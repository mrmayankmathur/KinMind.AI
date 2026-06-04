from fastapi import FastAPI
from app.routers import quest

# Initialize the app
app = FastAPI(title="KinMind AI Edge Server", description="The backend for the KinMind gamified learning app.")

# Include routers
app.include_router(quest.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the KinMind AI Edge Server! The Grand Lighthouse is illuminated."}
