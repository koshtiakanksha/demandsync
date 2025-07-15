import axios from 'axios';

export interface SalesDataPoint {
  date: string;
  sales: number;
}

export interface ForecastPoint {
  ds: string;
  yhat: number;
  yhat_lower: number;
  yhat_upper: number;
}

export async function getForecast(
  sku: string,
  store_id: number,
  sales_data: SalesDataPoint[]
): Promise<ForecastPoint[]> {
  const response = await axios.post('http://127.0.0.1:8000/forecast', {
    sku,
    store_id,
    sales_data
  });
  return response.data.forecast;
}
