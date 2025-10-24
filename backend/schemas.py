from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: Optional[str] = "member"
    active: Optional[bool] = True

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    org_id: int
    class Config:
        orm_mode = True

class OrganizationBase(BaseModel):
    name: str
    description: Optional[str] = None

class OrganizationCreate(OrganizationBase):
    pass

class Organization(OrganizationBase):
    id: int
    class Config:
        orm_mode = True