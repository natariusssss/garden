from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator
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
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginForm(BaseModel):
    login: str
    password: str

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True

class TopicBase(BaseModel):
    name: str
    description: Optional[str] = None
    category_id: int
    tree_type: Optional[str] = "default"
    rarity: Optional[str] = "common"
    image_url: Optional[str] = ""

class TopicCreate(TopicBase):
    pass

class TopicUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    tree_type: Optional[str] = None
    rarity: Optional[str] = None
    image_url: Optional[str] = None

class TopicResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str] = None
    category_id: Optional[int] = None
    category: Optional[CategoryResponse] = None
    level: int = 0
    xp: int = 0
    review_count: int = 0
    tree_state: str = "seed"
    tree_type: Optional[str] = None
    rarity: Optional[str] = None
    image_url: Optional[str] = None

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

class UserStats(BaseModel):
    total_xp: int
    level: int
    reviews_count: int
    topics_count: int
    streak: int

class FriendRequest(BaseModel):
    friend_id: int

class FriendResponse(BaseModel):
    id: int
    username: str
    total_xp: int

class FriendStatus(BaseModel):
    status: str







