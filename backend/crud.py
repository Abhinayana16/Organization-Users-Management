from .models import organizations, users
from .database import database
from sqlalchemy import select, insert, update, delete

async def create_organization(org):
    query = insert(organizations).values(name=org.name, description=org.description)
    org_id = await database.execute(query)
    return {**org.dict(), "id": org_id}

async def list_organizations():
    query = select(organizations.c.id, organizations.c.name, organizations.c.description)
    return await database.fetch_all(query)

async def get_organization(org_id: int):
    query = select(organizations).where(organizations.c.id == org_id)
    return await database.fetch_one(query)

async def create_user(org_id: int, user):
    query = insert(users).values(org_id=org_id, name=user.name, email=user.email, role=user.role, active=user.active)
    user_id = await database.execute(query)
    return {**user.dict(), "id": user_id, "org_id": org_id}

async def list_users(org_id: int):
    query = select(users).where(users.c.org_id == org_id)
    return await database.fetch_all(query)

async def toggle_user_active(user_id: int, active: bool):
    query = update(users).where(users.c.id == user_id).values(active=active)
    await database.execute(query)
    return await database.fetch_one(select(users).where(users.c.id == user_id))