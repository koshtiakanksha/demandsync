import axios from 'axios';

export interface SalesRecord {
  ds: string;
  y: number;
}

export interface ForecastRequest {
  sku_id: number;
  store_id?: number;
  sales_data: SalesRecord[];
  period?: number;
}

export async function fetchForecast(payload: ForecastRequest) {
  const response = await axios.post('http://127.0.0.1:8000/forecast/sku', payload);
  return response.data;
}
