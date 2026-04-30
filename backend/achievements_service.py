from sqlalchemy.orm import Session
from models import User, Achievement, UserAchievement, UserTopic, ReviewHistory

def get_user_progress(db: Session, user_id):
    user=db.query(User).filter(User.id == user_id).first()
    if user is None:
        return None
    reviews_count=db.query(ReviewHistory).filter(ReviewHistory.user_id == user.id).count()
    topics_count=db.query(UserTopic).filter(UserTopic.user_id == user.id).count()
    user_xp=user.total_xp
    return {
        "total_xp": user_xp,
        "topics_count": topics_count,
        "reviews_count": reviews_count
    }

def get_unlock_achievement_ids(db: Session, user_id):
    user_achievements=db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()
    return {item.achievement_id for item in user_achievements}

def is_achievement_completed(achievement, progress):
    if achievement.condition_type == "total_xp":
        return progress["total_xp"] >= achievement.condition_value
    elif achievement.condition_type == "topics_count":
        return progress["topics_count"] >= achievement.condition_value
    elif achievement.condition_type == "reviews_count":
        return progress["reviews_count"] >= achievement.condition_value
    else:
        return False

def unlock_achievement(db: Session, user_id, achievement_id):
    user_achievement=UserAchievement(user_id=user_id, achievement_id=achievement_id)
    db.add(user_achievement)

def check_and_unlock_achievements(db: Session, user_id):
    progress=get_user_progress(db, user_id)
    if progress is None:
        return []
    achievements=db.query(Achievement).all()
    unlocked_ids=get_unlock_achievement_ids(db, user_id)
    new_achievements=[]
    for achievement in achievements:
        if achievement.id in unlocked_ids:
            continue
        if is_achievement_completed(achievement, progress):
            unlock_achievement(db, user_id, achievement.id)
            new_achievements.append(achievement)
    if new_achievements:
        db.commit()
    return new_achievements

def get_current_value_for_achievement(achievement, progress):
    if achievement.condition_type == "total_xp":
        return progress["total_xp"]
    elif achievement.condition_type == "topics_count":
        return progress["topics_count"]
    elif achievement.condition_type == "reviews_count":
        return progress["reviews_count"]
    else:
        return 0

def get_achievements_progress(db: Session, user_id: int):
    progress=get_user_progress(db, user_id)
    if progress is None:
        return []
    achievements=db.query(Achievement).all()
    user_achievements=db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()
    unlocked_map={item.achievement_id: item for item in user_achievements}
    result=[]
    for achievement in achievements:
        current_value = get_current_value_for_achievement(achievement, progress)
        unlocked_entry=unlocked_map.get(achievement.id)
        result.append({
            "id": achievement.id,
            "code": achievement.code,
            "title": achievement.title,
            "description": achievement.description,
            "icon_url": achievement.icon_url,
            "condition_type": achievement.condition_type,
            "condition_value": achievement.condition_value,
            "current_value": current_value,
            "is_unlocked": unlocked_entry is not None,
            "unlocked_at": unlocked_entry.unlocked_at if unlocked_entry else None,
        })

    return result




