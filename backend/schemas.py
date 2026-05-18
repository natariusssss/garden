from datetime import datetime
from typing import Optional, Union
from pydantic import BaseModel, EmailStr, field_validator, Field
import re


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    @field_validator("username")
    def validate_username(cls, v):
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError(
                "Username must contain only letters, numbers and underscore"
            )
        return v

    @field_validator("password")
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime
    description: Optional[str] = None

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    username: Optional[str] = None
    description: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str


class LoginForm(BaseModel):
    login: str
    password: str


class TopicBase(BaseModel):
    name: str
    description: Optional[str] = None
    plant_code: Optional[str] = None
    tree_type: Optional[str] = "default"
    rarity: Optional[str] = "common"
    image_url: Optional[str] = ""


class TopicCreate(TopicBase):
    pass


class TopicUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    plant_code: Optional[str] = None
    tree_type: Optional[str] = None
    rarity: Optional[str] = None
    image_url: Optional[str] = None


class AchievementResponse(BaseModel):
    id: int
    code: str
    title: str
    description: Optional[str] = None
    icon_url: Optional[str] = None
    condition_type: str
    condition_value: int

    class Config:
        from_attributes = True


class UserAchievementResponse(BaseModel):
    id: int
    user_id: int
    achievement_id: int
    unlocked_at: Optional[datetime] = None
    achievement: AchievementResponse

    class Config:
        from_attributes = True


class PlantRewardResponse(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    rarity: str
    tree_type: Optional[str] = None
    image_url: Optional[str] = None
    imgBig: Optional[str] = None


class AchievementRewardResponse(BaseModel):
    type: str
    value: Union[str, int]
    plant: Optional[PlantRewardResponse] = None


class AchievementProgressResponse(BaseModel):
    id: int
    code: str
    title: str
    description: Optional[str] = None
    icon_url: Optional[str] = None
    condition_type: str
    condition_value: int
    current_value: int
    progress_percent: float = 0
    reward_category: Optional[str] = None
    is_unlocked: bool
    unlocked_at: Optional[datetime] = None
    rewards: list[AchievementRewardResponse] = []

    class Config:
        from_attributes = True


class TopicResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str] = None

    level: int = 0
    xp: int = 0
    current_max_xp: int = 100
    current_progress_xp: int = 0
    progress_width: str = "0%"

    review_count: int = 0
    tree_state: str = "seed"
    tree_type: Optional[str] = None
    rarity: Optional[str] = None
    image_url: Optional[str] = None
    is_dry: bool = False

    new_achievements: list[AchievementProgressResponse] = Field(default_factory=list)

    last_reviewed: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserTopicCreate(BaseModel):
    topic_id: int
    level: Optional[int] = 0


class UserTopicResponse(BaseModel):
    id: int
    user_id: int
    topic_id: int
    level: int
    review_count: int
    last_reviewed: Optional[datetime] = None
    next_review_date: Optional[datetime] = None
    xp: int

    class Config:
        from_attributes = True


class ReviewCreate(BaseModel):
    success: bool


class ReviewHistoryResponse(BaseModel):
    id: int
    user_id: int
    topic_id: int
    reviewed_at: datetime
    success: bool

    class Config:
        from_attributes = True


class ReviewResultResponse(BaseModel):
    review: ReviewHistoryResponse
    xp_earned: int
    new_level: int
    new_achievements: list[AchievementProgressResponse] = []
    new_level_rewards: list[dict] = []


class UserStats(BaseModel):
    total_xp: int
    streak: int
    level: int
    topics_count: int
    reviews_count: int
    current_progress_xp: int
    current_max_xp: int
    progress_width: str


class FriendshipRequestCreate(BaseModel):
    friend_username: str


class FriendshipResponse(BaseModel):
    id: int
    user_id: int
    friend_id: int
    status: str
    created_at: datetime
    friend_username: str
    friend_email: str

    class Config:
        from_attributes = True


class FriendStatus(BaseModel):
    status: str


class TopicXPAdd(BaseModel):
    xp: int


class TopicXPResponse(BaseModel):
    xp: int
    level: int
    tree_state: str
    current_max_xp: int
    current_progress_xp: int
    progress_width: str
    image_url: Optional[str] = None
    is_dry: bool = False
    review_count: int = 0
    last_reviewed: Optional[datetime] = None
    new_achievements: list[AchievementProgressResponse] = []
    new_level_rewards: list[dict] = []


class ActionRequest(BaseModel):
    action: str
    topic_id: Optional[int] = None
