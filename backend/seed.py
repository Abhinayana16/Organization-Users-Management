import asyncio
from database import database, engine, metadata
from models import organizations, users

async def seed():
    await database.connect()
    metadata.create_all(bind=engine)
    # cleanup for idempotence
    await database.execute(users.delete())
    await database.execute(organizations.delete())
    # insert sample org + user
    q = organizations.insert().values(name="Sample Institute", description="Seeded organization")
    org_id = await database.execute(q)
    await database.execute(users.insert().values(org_id=org_id, name="Seed User", email="seed@example.com", role="admin", active=True))
    await database.disconnect()

if __name__ == "__main__":
    asyncio.run(seed())