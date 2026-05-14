import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from setconf import settings
from achievements_service import check_and_unlock_achievements, get_achievements_progress
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from models import Base, User, Topic, UserTopic, ReviewHistory, Friendship, UserAchievement, Achievement
import schemas
import crud
from typing import Optional, List
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
from sqlalchemy import func
from sqlalchemy import text
from crud import get_level_rewards_progress, subtract_topic_xp
from seed_plants import seed_plants
from seed_achievements import seed_achievements
from seed_level_rewards import seed_level_rewards
from utils import get_next_review_date
from level_rewards_service import check_and_unlock_level_rewards



limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def ensure_user_topic_decay_columns():
    # create_all не добавляет новые колонки в уже существующую SQLite-БД,
    # поэтому аккуратно добавляем поле для защиты от повторного списания XP.
    if not settings.DATABASE_URL.startswith("sqlite"):
        return

    with engine.begin() as connection:
        columns = connection.execute(text("PRAGMA table_info(user_topics)")).fetchall()
        column_names = {column[1] for column in columns}

        if "last_xp_penalty_at" not in column_names:
            connection.execute(text("ALTER TABLE user_topics ADD COLUMN last_xp_penalty_at DATETIME"))


ensure_user_topic_decay_columns()

def seed_initial_data():
    db = SessionLocal()
    try:
        seed_plants(db)
        seed_level_rewards(db)
        seed_achievements(db)
    finally:
        db.close()

seed_initial_data()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


def get_password(password):
    return pwd_context.hash(password)


def authenticate_user(db, login: str, password: str):
    user = db.query(User).filter(
        (User.username == login) | (User.email == login)
    ).first()
    if not user or not verify_password(password, user.password):
        return False
    return user


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def get_current_max_xp(level: int) -> int:
    if level == 0:
        return 100

    return 100 * level + 20 * level




def calculate_topic_progress_data(xp: int):
    total_xp = max(0, xp or 0)

    level = 0
    current_progress_xp = total_xp

    while current_progress_xp >= get_current_max_xp(level):
        current_progress_xp -= get_current_max_xp(level)
        level += 1

    current_max_xp = get_current_max_xp(level)

    progress_width = f"{round((current_progress_xp / current_max_xp) * 100, 2)}%"

    return {
        "level": level,
        "xp": total_xp,
        "current_max_xp": current_max_xp,
        "current_progress_xp": current_progress_xp,
        "progress_width": progress_width,
    }


def get_topic_progress_data(user_topic: Optional[UserTopic]):
    xp = user_topic.xp if user_topic else 0
    return calculate_topic_progress_data(xp)


DRY_AFTER_DAYS = 7


def is_user_topic_dry(user_topic: Optional[UserTopic]) -> bool:
    if not user_topic or not user_topic.last_reviewed:
        return False

    dry_date = user_topic.last_reviewed + timedelta(days=DRY_AFTER_DAYS)
    return datetime.now() >= dry_date



app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=schemas.UserResponse)
@limiter.limit("10/hour")
def register(user: schemas.UserCreate,request: Request, db: Session = Depends(get_db)):
    if not user.username or not user.email or not user.password:
        raise HTTPException(status_code=400, detail="All fields are required")
    existing = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        username=user.username,
        email=user.email,
        password=get_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/token", response_model=schemas.Token)
@limiter.limit("5/minute")
def login(form_data: OAuth2PasswordRequestForm = Depends(), request: Request = None, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.username == form_data.username) | (User.email == form_data.username)
    ).first()

    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Wrong login or password")

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/topics/create", response_model=schemas.TopicResponse, status_code=status.HTTP_201_CREATED)
def create_topic(
    topic: schemas.TopicCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    db_topic = Topic(
        user_id=current_user.id,
        name=topic.name,
        description=topic.description,
        tree_type=topic.tree_type,
        rarity=topic.rarity,
        image_url=topic.image_url,
    )
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)

    db_user_topic = UserTopic(
        user_id=current_user.id,
        topic_id=db_topic.id,
        tree_state="seed",
        level=0,
        xp=0,
        review_count=0,
    )
    db.add(db_user_topic)
    db.commit()
    db.refresh(db_user_topic)
    new_achievements = check_and_unlock_achievements(db, current_user.id)
    progress_data = get_topic_progress_data(db_user_topic)
    return {
        "id": db_topic.id,
        "user_id": db_topic.user_id,
        "name": db_topic.name,
        "description": db_topic.description,
        "tree_type": db_topic.tree_type,
        "rarity": db_topic.rarity,
        "image_url": db_topic.image_url,
        "tree_state": db_user_topic.tree_state,
        "review_count": db_user_topic.review_count,
        "new_achievements": new_achievements,

        **progress_data,
    }



@app.get("/topics/list", response_model=List[schemas.TopicResponse])
def get_my_topics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Topic).filter(Topic.user_id == current_user.id)

    topics = query.all()
    result = []

    for topic in topics:
        user_topic = db.query(UserTopic).filter(
            UserTopic.user_id == current_user.id,
            UserTopic.topic_id == topic.id
        ).first()

        if user_topic:
            user_topic = subtract_topic_xp(db, current_user.id, topic.id)
            db.refresh(user_topic)

        progress_data = get_topic_progress_data(user_topic)
        is_dry = is_user_topic_dry(user_topic)

        result.append({
            "id": topic.id,
            "user_id": topic.user_id,
            "name": topic.name,
            "description": topic.description,
            "tree_type": topic.tree_type,
            "rarity": topic.rarity,
            "image_url": get_tree_image_url(
                topic.image_url,
                user_topic.tree_state if user_topic else "seed",
                is_dry
            ),
            "is_dry": is_dry,

            "tree_state": user_topic.tree_state if user_topic else "seed",
            "review_count": user_topic.review_count if user_topic else 0,
            "last_reviewed": user_topic.last_reviewed if user_topic else None,
            **progress_data,
        })
    return result


@app.get("/topics/item/{topic_id}", response_model=schemas.TopicResponse)
def get_topic(
    topic_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    topic = db.query(Topic).filter(
        Topic.id == topic_id,
        Topic.user_id == current_user.id
    ).first()

    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    user_topic = db.query(UserTopic).filter(
        UserTopic.user_id == current_user.id,
        UserTopic.topic_id == topic.id
    ).first()

    if user_topic:
        user_topic = subtract_topic_xp(db, current_user.id, topic.id)
        db.refresh(user_topic)

    progress_data = get_topic_progress_data(user_topic)
    is_dry = is_user_topic_dry(user_topic)

    return {
        "id": topic.id,
        "user_id": topic.user_id,
        "name": topic.name,
        "description": topic.description,
        "tree_type": topic.tree_type,
        "rarity": topic.rarity,
        "image_url": get_tree_image_url(
             topic.image_url,
            user_topic.tree_state if user_topic else "seed",
            is_dry
        ),
        "is_dry": is_dry,
        "tree_state": user_topic.tree_state if user_topic else "seed",
        "review_count": user_topic.review_count if user_topic else 0,

        **progress_data,
    }

@app.put("/topics/update/{topic_id}", response_model=schemas.TopicResponse)
def update_topic(
        topic_id: int,
        topic: schemas.TopicUpdate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    db_topic = db.query(Topic).filter(
        Topic.id == topic_id,
        Topic.user_id == current_user.id
    ).first()

    if not db_topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    if topic.tree_type is not None:
        db_topic.tree_type = topic.tree_type
    if topic.rarity is not None:
        db_topic.rarity = topic.rarity
    if topic.image_url is not None:
        db_topic.image_url = topic.image_url

    if topic.name is not None:
        db_topic.name = topic.name
    if topic.description is not None:
        db_topic.description = topic.description

    db.commit()
    db.refresh(db_topic)
    return db_topic

@app.delete("/topics/delete/{topic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_topic(
    topic_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_topic = db.query(Topic).filter(
        Topic.id == topic_id,
        Topic.user_id == current_user.id
    ).first()

    if not db_topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    user_topic = db.query(UserTopic).filter(
        UserTopic.topic_id == topic_id,
        UserTopic.user_id == current_user.id
    ).first()

    if user_topic:

        db.delete(user_topic)
        db.flush()

    db.delete(db_topic)
    db.commit()


@app.get("/my_profile", response_model=schemas.UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.put("/users/me/update", response_model=schemas.UserResponse)
def update_my_profile(
    payload: schemas.UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if payload.username:
        username = payload.username.strip()

        existing = db.query(User).filter(
            User.username == username,
            User.id != current_user.id
        ).first()

        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")

        current_user.username = username

    if payload.description is not None:
        current_user.description = payload.description.strip()

    db.commit()
    db.refresh(current_user)

    return current_user


@app.get("/users/search")
def search_users(
    query: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    search = query.strip()

    if not search:
        return []

    users = db.query(User).filter(
        User.username.ilike(f"{search}%"),
        User.id != current_user.id
    ).limit(10).all()

    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "created_at": user.created_at,
        }
        for user in users
    ]

@app.get("/")
def root():
    return {"message": "Garden is running"}

@app.post("/reviews/{user_topic_id}", response_model=schemas.ReviewResultResponse)
def create_review_endpoint(
        user_topic_id: int,
        review: schemas.ReviewCreate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    result = crud.create_review(
        db=db,
        user_id=current_user.id,
        user_topic_id=user_topic_id,
        success=review.success
    )
    if not result:
        raise HTTPException(status_code=404, detail="UserTopic not found")
    return result


@app.get("/reviews/due", response_model=List[schemas.UserTopicResponse])
def get_due_topics_endpoint(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    due_topics = crud.get_due_topics(
        db=db,
        user_id=current_user.id
    )
    return due_topics

@app.get("/users/me/stats", response_model=schemas.UserStats)
def get_user_stats_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stats=crud.get_user_stats(
        db=db,
        user_id=current_user.id
    )
    if not stats:
        raise HTTPException(status_code=404, detail="UserStats not found")
    return stats


@app.get("/reviews/history", response_model=List[schemas.ReviewHistoryResponse])
def get_review_history_endpoint(
        limit: int = 50,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    history = crud.get_review_history(db=db, limit=limit, user_id=current_user.id)
    return history


@app.post("/friendships/request", status_code=status.HTTP_201_CREATED)
def send_friend_request(
        request: schemas.FriendshipRequestCreate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    friend = db.query(User).filter(User.username == request.friend_username).first()
    if not friend:
        raise HTTPException(status_code=404, detail="User not found")
    if friend.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot add yourself")

    existing = db.query(Friendship).filter(
        ((Friendship.user_id == current_user.id) & (Friendship.friend_id == friend.id)) & (Friendship.status.in_(["pending", "accepted"])) |
        ((Friendship.user_id == friend.id) & (Friendship.friend_id == current_user.id)) & (Friendship.status.in_(["pending", "accepted"]))
    ).first()

    if existing:
        if existing.status == 'pending':
            raise HTTPException(status_code=400, detail="Request already pending")
        elif existing.status == 'accepted':
            raise HTTPException(status_code=400, detail="Already friends")

    new_request = Friendship(user_id=current_user.id, friend_id=friend.id, status="pending")
    db.add(new_request)
    db.commit()
    return {"message": f"Friend request sent to {friend.username}"}


@app.get("/friendships/pending")
def get_pending_requests(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    requests = db.query(Friendship, User).join(User, Friendship.user_id == User.id).filter(
        Friendship.friend_id == current_user.id,
        Friendship.status == "pending"
    ).all()

    return [
        {"id": req.id, "user_id": user.id, "username": user.username, "email": user.email, "created_at": req.created_at}
        for req, user in requests]


@app.put("/friendships/accept/{request_id}")
def accept_friend_request(
        request_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    friendship = db.query(Friendship).filter(
        Friendship.id == request_id,
        Friendship.friend_id == current_user.id,
        Friendship.status == "pending"
    ).first()
    if not friendship:
        raise HTTPException(status_code=404, detail="Request not found")

    friendship.status = "accepted"
    db.commit()

    # После принятия заявки сразу проверяем достижения у обоих пользователей,
    # потому что friends_count считается только по accepted-дружбам.
    check_and_unlock_achievements(db, friendship.user_id)
    check_and_unlock_achievements(db, friendship.friend_id)

    return {"message": "Friend request accepted"}


@app.put("/friendships/reject/{request_id}")
def reject_friend_request(
        request_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    friendship = db.query(Friendship).filter(
        Friendship.id == request_id,
        Friendship.friend_id == current_user.id,
        Friendship.status == "pending"
    ).first()
    if not friendship:
        raise HTTPException(status_code=404, detail="Request not found")

    friendship.status = "rejected"
    db.commit()
    return {"message": "Friend request rejected"}


@app.get("/friends")
def get_friends(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    friendships = db.query(Friendship).filter(
        ((Friendship.user_id == current_user.id) | (Friendship.friend_id == current_user.id)),
        Friendship.status == "accepted"
    ).all()

    result = []
    for f in friendships:
        friend_id = f.friend_id if f.user_id == current_user.id else f.user_id
        friend = db.query(User).filter(User.id == friend_id).first()

        total_xp = db.query(func.sum(UserTopic.xp)).filter(UserTopic.user_id == friend.id).scalar() or 0
        level = int((total_xp ** 0.5) / 10) + 1 if total_xp > 0 else 1

        result.append({
            "id": friend.id,
            "username": friend.username,
            "email": friend.email,
            "total_xp": total_xp,
            "level": level,
            "joined_at": friend.created_at
        })

    return result


@app.delete("/friends/{friend_id}")
def remove_friend(
        friend_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):

    friendship = db.query(Friendship).filter(
        ((Friendship.user_id == current_user.id) & (Friendship.friend_id == friend_id)) |
        ((Friendship.friend_id == current_user.id) & (Friendship.user_id == friend_id)),
        Friendship.status == "accepted"
    ).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Friendship not found")

    db.delete(friendship)
    db.commit()

    return {"message": "Friend removed successfully"}


@app.get("/friends/leaderboard")
def friends_leaderboard(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):


    friendships = db.query(Friendship).filter(
        ((Friendship.user_id == current_user.id) | (Friendship.friend_id == current_user.id)),
        Friendship.status == "accepted"
    ).all()

    friends_ids = []
    for f in friendships:
        friend_id = f.friend_id if f.user_id == current_user.id else f.user_id
        friends_ids.append(friend_id)


    friends_ids.append(current_user.id)

    result = []
    for uid in friends_ids:
        user = db.query(User).filter(User.id == uid).first()
        total_xp = db.query(func.sum(UserTopic.xp)).filter(UserTopic.user_id == uid).scalar() or 0
        level = int((total_xp ** 0.5) / 10) + 1 if total_xp > 0 else 1

        result.append({
            "user_id": uid,
            "username": user.username,
            "total_xp": total_xp,
            "level": level,
            "is_me": uid == current_user.id
        })

    result.sort(key=lambda x: x["total_xp"], reverse=True)

    for i, item in enumerate(result):
        item["rank"] = i + 1

    return result


@app.get("/friends/{friend_id}/progress")
def get_friend_progress(
        friend_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):

    friendship = db.query(Friendship).filter(
        ((Friendship.user_id == current_user.id) & (Friendship.friend_id == friend_id)) |
        ((Friendship.friend_id == current_user.id) & (Friendship.user_id == friend_id)),
        Friendship.status == "accepted"
    ).first()

    if not friendship:
        raise HTTPException(status_code=403, detail="You are not friends with this user")

    friend = db.query(User).filter(User.id == friend_id).first()

    topics = db.query(Topic).filter(Topic.user_id == friend_id).all()

    total_xp = db.query(func.sum(UserTopic.xp)).filter(UserTopic.user_id == friend_id).scalar() or 0
    total_level = int((total_xp ** 0.5) / 10) + 1 if total_xp > 0 else 1

    topics_progress = []
    for topic in topics:
        user_topic = db.query(UserTopic).filter(
            UserTopic.user_id == friend_id,
            UserTopic.topic_id == topic.id
        ).first()

        topics_progress.append({
            "id": topic.id,
            "name": topic.name,
            "xp": user_topic.xp if user_topic else 0,
            "level": user_topic.level if user_topic else 1,
            "review_count": user_topic.review_count if user_topic else 0
        })

    return {
        "friend_id": friend_id,
        "username": friend.username,
        "total_xp": total_xp,
        "total_level": total_level,
        "topics_count": len(topics),
        "topics": topics_progress
    }




@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "message": "API is running"
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database error: {str(e)}")


@app.get("/users/me/achievements", response_model=List[schemas.UserAchievementResponse])
def get_my_achievements(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    achievements=db.query(UserAchievement).filter(UserAchievement.user_id == current_user.id).all()
    return achievements


@app.get("/achievements", response_model=List[schemas.AchievementResponse])
def get_all_achievements(db: Session = Depends(get_db)):
    achievements=db.query(Achievement).all()
    return achievements

@app.get("/users/me/achievements/progress", response_model=List[schemas.AchievementProgressResponse])
def get_my_achievements_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Перед выдачей списка сначала проверяем, не появились ли новые выполненные достижения.
    check_and_unlock_achievements(db, current_user.id)
    return get_achievements_progress(db, current_user.id)


@app.post("/topics/add-xp/{topic_id}", response_model=schemas.TopicXPResponse)
def add_xp_to_topic(
    topic_id: int,
    payload: schemas.TopicXPAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_topic = db.query(UserTopic).filter(
        UserTopic.topic_id == topic_id,
        UserTopic.user_id == current_user.id
    ).first()

    if not user_topic:
        raise HTTPException(status_code=404, detail="UserTopic not found")

    topic = db.query(Topic).filter(
        Topic.id == topic_id,
        Topic.user_id == current_user.id
    ).first()

    xp_to_add = max(0, payload.xp)
    now = datetime.now()

    # ВАЖНО: повторение должно фиксироваться всегда при отправке таймера,
    # даже если xp_to_add = 0. Иначе достижение "Первый шаг" остаётся 0/1.
    user_topic.review_count = (user_topic.review_count or 0) + 1
    user_topic.last_reviewed = now
    user_topic.last_xp_penalty_at = None

    db.add(ReviewHistory(
        user_id=current_user.id,
        topic_id=user_topic.topic_id,
        success=True,
        reviewed_at=now,
    ))

    if xp_to_add > 0:
        user_topic.xp = (user_topic.xp or 0) + xp_to_add

        user = db.get(User, current_user.id)
        if user:
            user.total_xp = (user.total_xp or 0) + xp_to_add

    progress_data = calculate_topic_progress_data(user_topic.xp or 0)
    user_topic.level = progress_data["level"]

    if user_topic.level >= 20:
        user_topic.tree_state = "adult"
    elif user_topic.level >= 10:
        user_topic.tree_state = "young"
    else:
        user_topic.tree_state = "seed"

    user_topic.next_review_date = get_next_review_date(user_topic.level)

    db.flush()

    new_achievements = check_and_unlock_achievements(db, current_user.id)
    new_level_rewards = check_and_unlock_level_rewards(db, current_user.id)

    is_dry = is_user_topic_dry(user_topic)
    image_url = get_tree_image_url(
        topic.image_url if topic else None,
        user_topic.tree_state,
        is_dry
    )

    db.commit()
    db.refresh(user_topic)

    return {
        "xp": user_topic.xp,
        "level": user_topic.level,
        "tree_state": user_topic.tree_state,
        "image_url": image_url,
        "is_dry": is_dry,
        "review_count": user_topic.review_count,
        "last_reviewed": user_topic.last_reviewed,
        "current_max_xp": progress_data["current_max_xp"],
        "current_progress_xp": progress_data["current_progress_xp"],
        "progress_width": progress_data["progress_width"],
        "new_achievements": new_achievements,
        "new_level_rewards": new_level_rewards,
    }


def get_tree_image_url(image_url: str | None, tree_state: str, is_dry: bool = False):
    if not image_url:
        return None

    if is_dry:
        target_suffix = "_dry"
    else:
        state_to_suffix = {
            "seed": "_small",
            "young": "_medium",
            "adult": "_big",
        }

        target_suffix = state_to_suffix.get(tree_state, "_small")

    for suffix in ["_small", "_medium", "_big", "_dry"]:
        if suffix in image_url:
            return image_url.replace(suffix, target_suffix)

    return image_url


@app.get("/level-rewards")
def get_my_level_rewards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_level_rewards_progress(db, current_user.id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
