from models import UserTopic, ReviewHistory, User, Friendship
from sqlalchemy.orm import Session
from sqlalchemy import or_
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
    user_topic.next_review_date=get_next_review_date(user_topic.level)
    user_topic.xp+=xp_earned
    review=ReviewHistory( user_id=user_id, topic_id=user_topic.topic_id, success=success, reviewed_at=datetime.now())
    db.add(review)
    user=db.get(User, user_id)
    if user:
        user.total_xp+=xp_earned
    db.commit()
    new_achievements=check_and_unlock_achievements(db, user_id)
    db.refresh(review)
    return {
        "review": review,
        "xp_earned": xp_earned,
        "new_level": user_topic.level,
        "new_achievements": new_achievements,
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
    friendships=db.query(Friendship).filter(((Friendship.user_id == user_id)|(Friendship.friend_id == user_id))&(Friendship.status == 'accepted')).all()







                                   











