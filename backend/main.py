from fastapi import FastAPI, HTTPException
from .database import database, metadata, engine
from .models import organizations, users
from .schemas import OrganizationCreate, Organization, UserCreate, User
from . import crud
import os

app = FastAPI(title="Organization & Users API")

@app.on_event("startup")
async def startup():
    # create tables if using in-memory/local DB (for convenience)
    metadata.create_all(bind=engine)
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.post("/orgs/", response_model=Organization)
async def create_org(org: OrganizationCreate):
    return await crud.create_organization(org)

@app.get("/orgs/", response_model=list[Organization])
async def get_orgs():
    return await crud.list_organizations()

@app.get("/orgs/{org_id}", response_model=Organization)
async def get_org(org_id: int):
    org = await crud.get_organization(org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org

@app.post("/orgs/{org_id}/users/", response_model=User)
async def add_user(org_id: int, user: UserCreate):
    org = await crud.get_organization(org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return await crud.create_user(org_id, user)

@app.get("/orgs/{org_id}/users/", response_model=list[User])
async def get_users(org_id: int):
    return await crud.list_users(org_id)

@app.patch("/users/{user_id}/active")
async def set_active(user_id: int, active: bool):
    updated = await crud.toggle_user_active(user_id, active)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status":"ok"}