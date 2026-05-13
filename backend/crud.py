from models import UserTopic, ReviewHistory, User, Friendship, Topic
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from datetime import datetime, timedelta
from utils import get_next_review_date
from math import sqrt
from achievements_service import check_and_unlock_achievements
from models import UserTopic, ReviewHistory, User, Friendship
from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime, timedelta
from utils import get_next_review_date
from math import sqrt
from level_rewards_service import check_and_unlock_level_rewards
from models import LevelReward, UserLevelReward

def create_review(db: Session, user_id: int, user_topic_id: int, success: bool):
    user_topic=db.query(UserTopic).filter(UserTopic.id == user_topic_id, UserTopic.user_id == user_id
    ).first()
    if not user_topic:
        return None
    if success:
        xp_earned=10
        user_topic.level+=1
    else:
        xp_earned=5
        user_topic.level = max(0, user_topic.level - 1)
    user_topic.review_count += 1
    user_topic.last_reviewed = datetime.now()
    user_topic.last_xp_penalty_at = None
    user_topic.next_review_date=get_next_review_date(user_topic.level)
    user_topic.xp+=xp_earned
    review=ReviewHistory( user_id=user_id, topic_id=user_topic.topic_id, success=success, reviewed_at=datetime.now())
    db.add(review)
    user=db.get(User, user_id)
    if user:
        user.total_xp+=xp_earned
    db.commit()
    new_achievements=check_and_unlock_achievements(db, user_id)
    new_level_rewards = check_and_unlock_level_rewards(db, user_id)
    db.refresh(review)
    return {
        "review": review,
        "xp_earned": xp_earned,
        "new_level": user_topic.level,
        "new_achievements": new_achievements,
        "new_level_rewards": new_level_rewards,
    }
def get_due_topics(db: Session, user_id: int):
    repeat_topics=db.query(UserTopic).filter(UserTopic.user_id==user_id, or_(
        UserTopic.next_review_date<=datetime.now(), UserTopic.next_review_date==None)).all()
    return repeat_topics
def calculate_user_level(xp: int) -> int:
    level=int(sqrt(xp/100)+1)
    return level
def get_user_stats(db: Session, user_id: int):
    user = db.get(User, user_id)
    if not user:
        return None
    topics_count=db.query(UserTopic).filter(UserTopic.user_id==user_id).count()
    reviews_count=db.query(ReviewHistory).filter(ReviewHistory.user_id==user_id).count()
    last_review=db.query(ReviewHistory).filter(ReviewHistory.user_id==user_id).order_by(ReviewHistory.reviewed_at.desc()).first()
    streak=0
    if last_review:
        today=datetime.now().date()
        if last_review.reviewed_at.date()==today:
            streak=1
        elif last_review.reviewed_at.date() == today - timedelta(days=1):
            streak=1
    level=calculate_user_level(user.total_xp)
    return {'total_xp': user.total_xp, 'streak': streak, 'level': level, 'topics_count': topics_count,
            'reviews_count': reviews_count}
def get_review_history(db: Session, user_id: int, limit=50):
    review_his=db.query(ReviewHistory).filter(ReviewHistory.user_id==user_id).order_by(ReviewHistory.reviewed_at.desc()).limit(limit).all()
    return review_his
def count_reviews(db: Session, user_id: int):
    repetitions=db.query(ReviewHistory).filter(ReviewHistory.user_id==user_id).count()
    return repetitions
def send_friend_requests(db: Session, user_id: int, friend_id: int):
    if user_id == friend_id:
        return None
    existing = db.query(Friendship).filter(
        ((Friendship.user_id == user_id) & (Friendship.friend_id == friend_id)) |
        ((Friendship.user_id == friend_id) & (Friendship.friend_id == user_id))
    ).first()
    if existing:
        return None
    friendship=Friendship(user_id=user_id, friend_id=friend_id, status='pending')
    db.add(friendship)
    db.commit()
    db.refresh(friendship)
    return friendship
def get_friends(db: Session, user_id: int):
    friendships = db.query(Friendship).filter(Friendship.status == "accepted", or_(Friendship.user_id == user_id,Friendship.friend_id == user_id)).all()
    friends = []
    for friendship in friendships:
        friend_id = (
            friendship.friend_id
            if friendship.user_id==user_id
            else friendship.user_id
        )
        friend = db.query(User).filter(User.id == friend_id).first()
        if friend:
            friends.append({
                "friendship_id": friendship.id,
                "id": friend.id,
                "username": friend.username,
                "email": friend.email,
                "total_xp": friend.total_xp,
                "level": calculate_user_level(friend.total_xp),
            })
    return friends
def get_pending_friend_requests(db: Session, user_id: int):
    requests = db.query(Friendship).filter(Friendship.friend_id == user_id, Friendship.status == "pending").all()
    result = []
    for request in requests:
        sender=db.query(User).filter(User.id == request.user_id).first()
        if sender:
            result.append({
                "request_id": request.id,
                "user_id": sender.id,
                "username": sender.username,
                "email": sender.email,
                "total_xp": sender.total_xp,
                "level": calculate_user_level(sender.total_xp),
                "status": request.status,
            })
    return result
def accept_friend_request(db: Session, user_id: int, request_id: int):
    friendship = db.query(Friendship).filter(Friendship.id == request_id, Friendship.friend_id == user_id,Friendship.status == "pending").first()
    if not friendship:
        return None
    friendship.status = "accepted"
    db.commit()
    db.refresh(friendship)
    check_and_unlock_achievements(db, friendship.user_id)
    check_and_unlock_achievements(db, friendship.friend_id)
    return friendship
def reject_friend_request(db: Session, user_id: int, request_id: int):
    friendship = db.query(Friendship).filter(Friendship.id==request_id, Friendship.friend_id == user_id, Friendship.status=="pending").first()
    if not friendship:
        return None
    friendship.status="rejected"
    db.commit()
    db.refresh(friendship)
    return friendship
def delete_friend(db: Session, user_id: int, friend_id: int):
    friendship=db.query(Friendship).filter(Friendship.status=="accepted", or_(and_(Friendship.user_id == user_id, Friendship.friend_id == friend_id),and_(Friendship.user_id == friend_id, Friendship.friend_id == user_id))).first()
    if not friendship:
        return None
    db.delete(friendship)
    db.commit()
    return True
def get_level_rewards_progress(db: Session, user_id: int):
    rewards = db.query(LevelReward).order_by(LevelReward.level).all()
    user_rewards = db.query(UserLevelReward).filter(UserLevelReward.user_id == user_id).all()
    unlocked_ids = {
        item.level_reward_id for item in user_rewards
    }
    result = []
    for reward in rewards:
        plant = reward.plant
        result.append({
            "id": reward.id,
            "level": reward.level,
            "title": reward.title,
            "description": reward.description,
            "is_unlocked": reward.id in unlocked_ids,
            "plant": {
                "code": plant.code,
                "name": plant.name,
                "description": plant.description,
                "rarity": plant.rarity,
                "tree_type": plant.tree_type,
                "image_url": plant.image_url,
            } if plant else None,
        })
    return result

XP_PENALTY_AFTER_DAYS = 7
XP_PENALTY_PER_DAY = 100


def get_current_max_xp_for_decay(level: int) -> int:
    if level == 0:
        return 100

    return 100 * level + 20 * level


def calculate_level_by_xp(xp: int) -> int:
    total_xp = max(0, xp or 0)
    level = 0

    while total_xp >= get_current_max_xp_for_decay(level):
        total_xp -= get_current_max_xp_for_decay(level)
        level += 1

    return level


def get_tree_state_by_level(level: int) -> str:
    if level >= 20:
        return "adult"
    if level >= 10:
        return "young"
    return "seed"


def subtract_topic_xp(db: Session, user_id: int, topic_id: int):
    user_topic = (
        db.query(UserTopic)
        .filter(
            UserTopic.user_id == user_id,
            UserTopic.topic_id == topic_id,
        )
        .first()
    )

    if not user_topic or not user_topic.last_reviewed:
        return user_topic

    now = datetime.now()
    days_without_review = (now.date() - user_topic.last_reviewed.date()).days

    if days_without_review < XP_PENALTY_AFTER_DAYS:
        return user_topic

    if (
        user_topic.last_xp_penalty_at
        and user_topic.last_xp_penalty_at.date() == now.date()
    ):
        return user_topic

    if user_topic.last_xp_penalty_at:
        penalty_days = (now.date() - user_topic.last_xp_penalty_at.date()).days
    else:
        penalty_days = days_without_review - XP_PENALTY_AFTER_DAYS + 1

    if penalty_days <= 0:
        return user_topic

    old_xp = user_topic.xp or 0
    penalty_xp = penalty_days * XP_PENALTY_PER_DAY

    user_topic.xp = max(old_xp - penalty_xp, 0)
    removed_xp = old_xp - user_topic.xp

    user_topic.level = calculate_level_by_xp(user_topic.xp)
    user_topic.tree_state = get_tree_state_by_level(user_topic.level)
    user_topic.last_xp_penalty_at = now

    user = db.get(User, user_id)
    if user:
        user.total_xp = max((user.total_xp or 0) - removed_xp, 0)

    db.commit()
    db.refresh(user_topic)

    return user_topic





                                   











