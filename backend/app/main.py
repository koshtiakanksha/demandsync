from fastapi import FastAPI

from app.api import auth, sales, inventory, forecast

app = FastAPI(title="DemandSync API")

app.include_router(auth.router)
app.include_router(sales.router)
app.include_router(inventory.router)
app.include_router(forecast.router)

@app.get("/")
def root():
    return {"message": "DemandSync API"}