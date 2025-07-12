import React from 'react';
import Plot from 'react-plotly.js';

export interface ForecastPoint {
  ds: string;
  yhat: number;
  yhat_lower: number;
  yhat_upper: number;
}

interface Props {
  skuId: number;
  forecast: ForecastPoint[];
}

const ForecastChart: React.FC<Props> = ({ skuId, forecast }) => {
  const dates = forecast.map(p => p.ds);
  const yhat = forecast.map(p => p.yhat);
  const lower = forecast.map(p => p.yhat_lower);
  const upper = forecast.map(p => p.yhat_upper);

  return (
    <Plot
      data={[
        {
          x: dates,
          y: yhat,
          type: 'scatter',
          mode: 'lines',
          name: 'Forecast',
          line: { color: 'blue' },
        },
        {
          x: [...dates, ...dates.slice().reverse()],
          y: [...upper, ...lower.slice().reverse()],
          fill: 'toself',
          fillcolor: 'rgba(0,0,255,0.2)',
          line: { color: 'transparent' },
          showlegend: false,
          type: 'scatter',
        },
      ]}
      layout={{
        title: `SKU ${skuId} Forecast`,
        xaxis: { title: 'Date' },
        yaxis: { title: 'Demand' },
        margin: { t: 30, r: 10, l: 40, b: 40 },
      }}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default ForecastChart;
