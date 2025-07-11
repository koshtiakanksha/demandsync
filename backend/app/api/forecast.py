from fastapi import APIRouter

router = APIRouter(prefix="/forecast", tags=["forecast"])

@router.get("/{product_id}")
def get_forecast(product_id: int):
    """Placeholder endpoint returning dummy forecast data."""
    return {
        "product_id": product_id,
        "forecast": [10, 12, 14]  # dummy 7-day forecast
    }