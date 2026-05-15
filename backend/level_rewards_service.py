from sqlalchemy.orm import Session
from models import User, Plant, UserPlant, LevelReward, UserLevelReward
from level_utils import calculate_account_level


def calculate_user_level(xp: int) -> int:
    return calculate_account_level(xp)

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
    }

def check_and_unlock_level_rewards(
    db: Session,
    user_id: int,
    previous_account_level: int | None = None
):
    user = db.get(User, user_id)
    if not user:
        return []
    current_level = calculate_user_level(user.total_xp)
    if previous_account_level is None:
        previous_account_level = max(current_level - 1, 0)
    available_rewards = db.query(LevelReward).filter(LevelReward.level <= current_level).all()
    unlocked_rewards = db.query(UserLevelReward).filter(UserLevelReward.user_id == user_id).all()
    unlocked_reward_ids = {
        item.level_reward_id for item in unlocked_rewards
    }
    new_rewards = []
    for reward in available_rewards:
        if reward.id in unlocked_reward_ids:
            continue
        user_level_reward = UserLevelReward(
            user_id=user_id,
            level_reward_id=reward.id
        )
        db.add(user_level_reward)
        plant = db.query(Plant).filter(Plant.code == reward.plant_code).first()
        if plant:
            existing_user_plant = db.query(UserPlant).filter(UserPlant.user_id == user_id, UserPlant.plant_code == plant.code).first()
            if not existing_user_plant:
                db.add(UserPlant(
                    user_id=user_id,
                    plant_code=plant.code,
                    source_achievement_id=None
                ))
        new_rewards.append({
            "id": reward.id,
            "level": reward.level,
            "account_level": current_level,
            "previous_level": previous_account_level,
            "new_level": current_level,
            "title": reward.title,
            "description": reward.description,
            "plant": plant_to_dict(plant),
        })
    if new_rewards:
        db.commit()
    return new_rewards