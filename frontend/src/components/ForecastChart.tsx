import Plot from 'react-plotly.js';

interface ForecastPoint {
  ds: string;
  yhat: number;
  yhat_lower: number;
  yhat_upper: number;
}

interface ForecastChartProps {
  data: ForecastPoint[];
}

export default function ForecastChart({ data }: ForecastChartProps) {
  const dates = data.map(d => d.ds);
  return (
    <Plot
      data={[
        {
          x: dates,
          y: data.map(d => d.yhat),
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Forecast',
        },
        {
          x: dates,
          y: data.map(d => d.yhat_upper),
          type: 'scatter',
          mode: 'lines',
          fill: 'tonexty',
          name: 'Upper Bound',
        },
        {
          x: dates,
          y: data.map(d => d.yhat_lower),
          type: 'scatter',
          mode: 'lines',
          fill: 'tonexty',
          name: 'Lower Bound',
        },
      ]}
      layout={{ title: 'SKU Forecast', xaxis: { title: 'Date' }, yaxis: { title: 'Sales' } }}
    />
  );
}
