from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, field_validator
import re

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    @field_validator("username")
    def validate_username(cls, v):
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError("Username must contain only letters, numbers and underscore")
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
    class Config:
        from_attributes=True
class CategoryBase(BaseModel):
    name: str
    description: Optional[str]=None
class CategoryCreate(CategoryBase):
    pass
class CategoryUpdate(CategoryBase):
    name: Optional[str]=None
class CategoryResponse(CategoryBase):
    user_id: int
    id: int
    class Config:
        from_attributes=True
class TopicBase(BaseModel):
    name: str
    description: Optional[str]=None
    category_id: int
class TopicResponse(TopicBase):
    id: int
    user_id: int
    category: Optional[CategoryResponse]=None
    class Config:
        from_attributes=True
class TopicCreate(TopicBase):
    pass
class TopicUpdate(TopicBase):
    name: Optional[str]=None
    description: Optional[str]=None
    category_id: Optional[int]=None
class UserTopicCreate(BaseModel):
    topic_id: int
    level: Optional[int]=0
class UserTopicResponse(BaseModel):
    id: int
    user_id: int
    topic_id: int
    level: int
    review_count: int
    last_reviewed: Optional[datetime]=None
    next_review_date: Optional[datetime]=None
    class Config:
        from_attributes=True
class ReviewHistoryCreate(BaseModel):
    topic_id: int
    success: bool
class ReviewHistoryResponse(BaseModel):
    id: int
    topic_id: int
    reviewed_at: datetime
    success: bool
    xp_earned: int
    next_level: int
    class Config:
        from_attributes=True
class Token(BaseModel):
    access_token: str
    token_type: str
class UserStats(BaseModel):
    total_xp: int
    level: int
    reviews_count: int
    topics_count: int
    streak: int
    class Config:
        from_attributes=True


class ReviewCreate(BaseModel):
    success: bool


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    topic_id: int
    reviewed_at: datetime
    success: bool

    class Config:
        from_attributes = True


class UserStats(BaseModel):
    total_xp: int
    total_level: int
    topics_in_progress: int
    topics_mastered: int
    streak_days: int
    total_reviews: int
    success_rate: float

class LoginForm(BaseModel):
    login: str
    password: str




