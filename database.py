from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. This creates a SQLite file called 'hostel.db' in your current folder
SQLITE_DATABASE_URL = "sqlite:///./hostel.db"

# 2. The Engine is the 'engine' that talks to the database
engine = create_engine(SQLITE_DATABASE_URL, connect_args={"check_same_thread": False})

# 3. SessionLocal is a temporary connection to talk with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Base is the main parent class for all our database tables
Base = declarative_base()

# 5. This is a helper function to get a database connection per request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
