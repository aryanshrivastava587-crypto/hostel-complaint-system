from sqlalchemy import Column, Integer, String, Boolean
from database import Base
from datetime import datetime

# This class translates python code into a SQL Table!
class DBComplaint(Base):
    # This is the name of the table in our database
    __tablename__ = "complaints"

    # These are the columns in our database table
    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String, index=True)
    room_number = Column(String)
    category = Column(String)
    description = Column(String)
    status = Column(String, default="pending")
    
    # We use String to store ISO format dates for simplicity in SQLite
    created_at = Column(String, default=lambda: datetime.now().isoformat())
    resolved_at = Column(String, nullable=True)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)
