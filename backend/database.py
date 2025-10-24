from databases import Database
from sqlalchemy import create_engine, MetaData
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
database = Database(DATABASE_URL)
metadata = MetaData()
# SQLAlchemy engine without async driver for migrations and metadata.create_all
engine = create_engine(DATABASE_URL.replace("+aiomysql", ""), pool_pre_ping=True)