from sqlalchemy import Table, Column, Integer, String, ForeignKey, Boolean, Text
from .database import metadata

organizations = Table(
    "organizations",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(255), nullable=False, unique=True),
    Column("description", Text, nullable=True),
)

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("org_id", Integer, ForeignKey("organizations.id", ondelete="CASCADE")),
    Column("name", String(255), nullable=False),
    Column("email", String(255), nullable=False, unique=True),
    Column("role", String(50), nullable=False, default="member"),
    Column("active", Boolean, default=True),
)