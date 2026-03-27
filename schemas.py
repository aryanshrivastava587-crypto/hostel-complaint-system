from pydantic import BaseModel, Field

# This is our Data "Bouncer" verifying incoming data
class ComplaintCreate(BaseModel):
    student_name: str = Field(..., min_length=2, max_length=50)
    room_number: str = Field(..., min_length=1, max_length=10)
    category: str = Field(..., min_length=3, max_length=50)
    description: str = Field(..., min_length=10, max_length=500)

# --- Authentication Schemas ---

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    password: str = Field(..., min_length=4)

class Token(BaseModel):
    access_token: str
    token_type: str
