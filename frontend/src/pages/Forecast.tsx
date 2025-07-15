import React from 'react';
import Plot from 'react-plotly.js';

export const Forecast = () => {
  const forecastDates = ['2025-07-01', '2025-07-02', '2025-07-03'];
  const forecastValues = [100, 120, 150];
  const upperBounds = [110, 130, 170];
  const lowerBounds = [90, 110, 130];

  return (
    <Plot
      data={[
        {
          x: forecastDates,
          y: forecastValues,
          type: 'scatter',
          mode: 'lines',
          name: 'Forecast',
        },
        {
          x: forecastDates,
          y: upperBounds,
          type: 'scatter',
          mode: 'lines',
          name: 'Upper Bound',
          line: { dash: 'dot', color: 'green' },
        },
        {
          x: forecastDates,
          y: lowerBounds,
          type: 'scatter',
          mode: 'lines',
          name: 'Lower Bound',
          line: { dash: 'dot', color: 'red' },
        },
      ]}
      layout={{ width: 720, height: 440, title: 'SKU Demand Forecast' }}
    />
  );
};

export default Forecast;
