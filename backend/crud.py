from models import UserTopic, ReviewHistory, User
from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime, timedelta
from utils import get_next_review_date
from math import sqrt
def create_review(db: Session, user_id: int, user_topic_id: int, success: bool):
    user_topic=db.query(UserTopic).filter(UserTopic.id==user_topic_id, UserTopic.user_id==user_id).first()
    if not user_topic:
        return None
    if success:
        xp_earned=10
        user_topic.level+=1
    else:
        xp_earned=5
        user_topic.level=max(0, UserTopic.level-1)
    user_topic.next_review_date=get_next_review_date(user_topic.level)
    user_topic.xp+=xp_earned
    review=ReviewHistory(user_id=user_id, topic_id=user_topic.topic_id, success=success, reviewed_at=datetime.now())
    db.add(review)
    user=db.query(User).get(user_id)
    user.total_xp+=xp_earned
    db.commit()
    return {'review': review, 'xp_earned': xp_earned, 'new_level': user_topic.level}
def get_due_topics(db: Session, user_id: int):
    repeat_topics=db.query(UserTopic).filter(UserTopic.user_id==user_id, or_(
        UserTopic.next_review_date<=datetime.now(), UserTopic.next_review_date==None)).all()
    return repeat_topics
def calculate_user_level(xp: int) -> int:
    level=int(sqrt(xp/100)+1)
    return level
def get_user_stats(db: Session, user_id: int):
    user=db.query(User).get(user_id)
    topics_count=db.query(UserTopic).filter(UserTopic.user_id==user_id).count()
    reviews_count=db.query(ReviewHistory).filter(ReviewHistory.user_id==user_id).count()
    last_review=db.query(ReviewHistory).filter(ReviewHistory.user_id==user_id).order_by(ReviewHistory.reviewed_at.desc()).first()
    streak=0
    if last_review:
        today=datetime.now().date()
        if last_review.reviewed_at==today:
            streak=1
        elif last_review.reviewed_at==today-timedelta(days=1):
            streak=1
    level=calculate_user_level(user.total_xp)
    return {'total_xp': user.total_xp, 'streak': streak, 'level': level, 'topics_count': topics_count,
            'reviews_count': reviews_count}





