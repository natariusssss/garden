from sqlalchemy.orm import Session
from models import User, Achievement, UserAchievement, UserTopic, ReviewHistory, Friendship, AchievementReward, Plant, UserPlant
from sqlalchemy import or_
from datetime import datetime, timedelta
from math import sqrt

def get_user_progress(db: Session, user_id):
    user=db.query(User).filter(User.id == user_id).first()
    if user is None:
        return None
    level = int(sqrt(user.total_xp / 10000) + 1)
    reviews_count=db.query(ReviewHistory).filter(ReviewHistory.user_id == user.id).count()
    topics_count=db.query(UserTopic).filter(UserTopic.user_id == user.id).count()
    user_xp=user.total_xp
    friends_count = db.query(Friendship).filter(
        Friendship.status == "accepted",
        or_(Friendship.user_id == user.id, Friendship.friend_id == user.id)
    ).count()
    days_streak=calculate_days_streak(db, user_id)
    return {
        "total_xp": user_xp,
        "topics_count": topics_count,
        "reviews_count": reviews_count,
        "friends_count": friends_count,
        "days_streak": days_streak,
        "level": level,
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
    elif achievement.condition_type == "friends_count":
        return progress["friends_count"] >= achievement.condition_value
    elif achievement.condition_type == "days_streak":
        return progress["days_streak"] >= achievement.condition_value
    elif achievement.condition_type == "level":
        return progress["level"] >= achievement.condition_value
    else:
        return False

def unlock_achievement(db: Session, user_id: int, achievement: Achievement):
    user_achievement = UserAchievement(user_id=user_id, achievement_id=achievement.id)
    db.add(user_achievement)
    rewards = apply_achievement_rewards(db, user_id, achievement)
    return rewards

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
            rewards = unlock_achievement(db, user_id, achievement)
            new_achievements.append({
                "id": achievement.id,
                "code": achievement.code,
                "title": achievement.title,
                "description": achievement.description,
                "icon_url": achievement.icon_url,
                "condition_type": achievement.condition_type,
                "condition_value": achievement.condition_value,
                "rewards": rewards,
            })
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
    elif achievement.condition_type == "friends_count":
        return progress["friends_count"]
    elif achievement.condition_type == "days_streak":
        return progress["days_streak"]
    elif achievement.condition_type == "level":
        return progress["level"]
    else:
        return 0

def get_reward_category(rewards):
    """Главная категория карточки для фронта: plant имеет приоритет над xp."""
    if any(reward.reward_type == "plant" for reward in rewards):
        return "plant"
    if any(reward.reward_type == "xp" for reward in rewards):
        return "xp"
    return None


def get_progress_percent(current_value: int, condition_value: int):
    if not condition_value or condition_value <= 0:
        return 0
    return min(100, round((current_value / condition_value) * 100, 2))


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
        rewards = [
            reward_to_dict(db, reward)
            for reward in achievement.rewards
        ]
        result.append({
            "id": achievement.id,
            "code": achievement.code,
            "title": achievement.title,
            "description": achievement.description,
            "icon_url": achievement.icon_url,
            "condition_type": achievement.condition_type,
            "condition_value": achievement.condition_value,
            "current_value": current_value,
            "progress_percent": get_progress_percent(current_value, achievement.condition_value),
            "reward_category": get_reward_category(achievement.rewards),
            "is_unlocked": unlocked_entry is not None,
            "unlocked_at": unlocked_entry.unlocked_at if unlocked_entry else None,
            "rewards": rewards,
        })

    return result

def calculate_days_streak(db: Session, user_id: int):
    reviews = db.query(ReviewHistory).filter(ReviewHistory.user_id == user_id).order_by(ReviewHistory.reviewed_at.desc()).all()
    if not reviews:
        return 0
    review_dates=sorted({review.reviewed_at.date() for review in reviews}, reverse=True)
    today = datetime.now().date()
    if review_dates[0]==today:
        current_day=today
    elif review_dates[0]==today-timedelta(days=1):
        current_day=today-timedelta(days=1)
    else:
        return 0
    streak=0
    for review_date in review_dates:
        if review_date==current_day:
            streak += 1
            current_day-=timedelta(days=1)
        elif review_date<current_day:
            break
    return streak

def plant_to_dict(plant):
    if not plant:
        return None
    return {
        "code": plant.code,
        "name": plant.name,
        "description": plant.description,
        "rarity": plant.rarity,
        "tree_type": plant.tree_type,
        "image_url": plant.image_url,
        "imgBig": plant.image_url,
    }


def apply_achievement_rewards(db: Session, user_id: int, achievement: Achievement):
    user = db.get(User, user_id)
    if not user:
        return []
    given_rewards = []
    for reward in achievement.rewards:
        if reward.reward_type == "xp":
            xp_amount = int(reward.reward_value)
            user.total_xp += xp_amount
            given_rewards.append({
                "type": "xp",
                "value": xp_amount,
            })
        elif reward.reward_type == "plant":
            plant_code = reward.reward_value
            plant = db.query(Plant).filter(Plant.code == plant_code).first()
            if not plant:
                continue
            existing_user_plant = db.query(UserPlant).filter( UserPlant.user_id == user_id, UserPlant.plant_code == plant.code).first()
            if not existing_user_plant:
                db.add(UserPlant(
                    user_id=user_id,
                    plant_code=plant.code,
                    source_achievement_id=achievement.id,
                ))
            given_rewards.append({
                "type": "plant",
                "value": plant.code,
                "plant": plant_to_dict(plant),
            })
    return given_rewards

def reward_to_dict(db: Session, reward: AchievementReward):
    if reward.reward_type == "xp":
        return {
            "type": "xp",
            "value": int(reward.reward_value),
        }
    if reward.reward_type == "plant":
        plant = db.query(Plant).filter(Plant.code == reward.reward_value).first()
        return {
            "type": "plant",
            "value": reward.reward_value,
            "plant": plant_to_dict(plant),
        }
    return {
        "type": reward.reward_type,
        "value": reward.reward_value,
    }


