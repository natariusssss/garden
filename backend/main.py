from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from models import User, Category, Topic
import schemas
import crud
from typing import Optional, List
from config import settings
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request


limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

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


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(db, login: str, password: str):
    user = db.query(User).filter(
        (User.username == login) | (User.email == login)
    ).first()
    if not user or not verify_password(password, user.password_hash):
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


app = FastAPI()


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
        password_hash=get_password_hash(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/token", response_model=schemas.Token)
@limiter.limit("5/minute")
def login(login_data: schemas.LoginForm,request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.username == login_data.login) | (User.email == login_data.login)
    ).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Wrong login or password")

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/topics/create", response_model=schemas.TopicResponse, status_code=status.HTTP_201_CREATED)
def create_topic(
        topic: schemas.TopicCreate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):

    category = db.query(Category).filter(
        Category.id == topic.category_id,
        Category.user_id == current_user.id
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    db_topic = Topic(
        user_id=current_user.id,
        category_id=topic.category_id,
        name=topic.name,
        description=topic.description
    )
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    return db_topic



@app.get("/topics/list", response_model=List[schemas.TopicResponse])
def get_my_topics(
        category_id: Optional[int] = None,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    query = db.query(Topic).filter(Topic.user_id == current_user.id)


    if category_id:
        query = query.filter(Topic.category_id == category_id)

    return query.all()


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

    return topic

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

    if topic.name is not None:
        db_topic.name = topic.name
    if topic.description is not None:
        db_topic.description = topic.description
    if topic.category_id is not None:
        new_category = db.query(Category).filter(
            Category.id == topic.category_id,
            Category.user_id == current_user.id
        ).first()
        if not new_category:
            raise HTTPException(status_code=404, detail="Category not found")
        db_topic.category_id = topic.category_id

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

    db.delete(db_topic)
    db.commit()
    return None


@app.get("/my_profile", response_model=schemas.UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user



@app.get("/")
def root():
    return {"message": "Garden is running"}

@app.post("/categories/create", response_model=schemas.CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
        category: schemas.CategoryCreate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):

    db_category = Category(
        user_id=current_user.id,
        name=category.name,
        description=category.description
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category



@app.get("/categories/list", response_model=List[schemas.CategoryResponse])
def get_my_categories(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    return db.query(Category).filter(Category.user_id == current_user.id).all()



@app.get("/categories/item/{category_id}", response_model=schemas.CategoryResponse)
def get_category(
        category_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    return category


@app.put("/categories/update/{category_id}", response_model=schemas.CategoryResponse)
def update_category(
        category_id: int,
        category: schemas.CategoryUpdate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    db_category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()

    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    if category.name is not None:
        db_category.name = category.name
    if category.description is not None:
        db_category.description = category.description

    db.commit()
    db.refresh(db_category)
    return db_category

@app.delete("/categories/delete/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
        category_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    db_category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()

    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(db_category)
    db.commit()
    return None

@app.post("/reviews/{user_topic_id}", response_model=schemas.ReviewResponse)
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)