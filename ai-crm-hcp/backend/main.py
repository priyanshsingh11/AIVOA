from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import crm, ai
from database.config import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-CRM HCP API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(crm.router, prefix="/api/crm", tags=["CRM"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])

@app.get("/")
async def root():
    return {"message": "Welcome to AI-CRM HCP API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
