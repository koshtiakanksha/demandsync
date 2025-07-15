from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, sales, inventory, forecast  # Your API routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ⬇ Your route registration
app.include_router(auth.router)
app.include_router(sales.router)
app.include_router(inventory.router)
app.include_router(forecast.router)
