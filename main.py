from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine

# Import our brand new router!
from routers import complaints, auth

# 1. Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hostel Complaint System")

# Allow web browsers from anywhere to access our API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Attach the separate routers to our main app!
app.include_router(auth.router)
app.include_router(complaints.router)

# 3. Simple root endpoints
@app.get("/")
def home():
    return {"message": "Hey!, Hostel Complaint System is running!!"}

@app.get("/about")
def about():
    return {
        "name": "Aryan",
        "project": "Hostel Complaint System",
        "version": "1.0.0.0"
    }

@app.get("/contact")
def contact():
    return {
        "Email": "aryanshrivastava587@gmail.com",
        "github": "aryanshrivastava587-crypto"
    }       

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)
