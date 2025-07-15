+13
-0

import pandas as pd
from prophet import Prophet


def forecast_sales(df: pd.DataFrame, period: int) -> pd.DataFrame:
    """Train a Prophet model on given sales dataframe and return forecast."""
    m = Prophet()
    df = df.copy()
    df["ds"] = pd.to_datetime(df["ds"])
    m.fit(df)
    future = m.make_future_dataframe(periods=period)
    forecast = m.predict(future)
    return forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(period)