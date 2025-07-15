from fastapi import APIRouter
from pydantic import BaseModel
import pandas as pd

from app.services.forecasting import forecast_sales

router = APIRouter(prefix="/forecast", tags=["forecast"])


class SalesRecord(BaseModel):
    ds: str
    y: float


class ForecastRequest(BaseModel):
    sku_id: int
    store_id: int | None = None
    sales_data: list[SalesRecord]
    period: int = 7


@router.post("/sku")
def forecast_sku(payload: ForecastRequest):
    df = pd.DataFrame([r.model_dump() for r in payload.sales_data])
    forecast = forecast_sales(df, payload.period)
    return forecast.to_dict(orient="records")
