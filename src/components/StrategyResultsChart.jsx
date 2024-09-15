import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

const StrategyResultsChart = ({ results }) => {
  if (!results || !Array.isArray(results.closePrices)) {
    console.error('Invalid results data:', results);
    return <div>Error: Invalid data for chart rendering</div>;
  }

  console.log('Chart data:', results);

  const MAX_POINTS = 1000;

  const downsampleData = (data) => {
    const factor = Math.ceil(data.length / MAX_POINTS);
    return data.filter((_, index) => index % factor === 0);
  };

  const generateTimestamps = (startDate, endDate, length) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const step = (end - start) / (length - 1);
    return Array.from({ length }, (_, i) => new Date(start.getTime() + step * i).toISOString());
  };

  const timestamps = generateTimestamps(results.startDate, results.endDate, results.closePrices.length);
  const downsampledTimestamps = downsampleData(timestamps);
  const downsampledClosePrices = downsampleData(results.closePrices);

  const traces = [
    {
      x: downsampledTimestamps,
      y: downsampledClosePrices,
      type: 'scatter',
      mode: 'lines',
      name: 'Close Price',
      line: { color: 'blue', width: 2 },
      yaxis: 'y',
      hovertemplate: '%{x}<br>Close: %{y}<br>',
    }
  ];

  if (results.buySignals && results.buySignals.length > 0) {
    traces.push({
      x: results.buySignals.map(signal => signal.timestamp),
      y: results.buySignals.map(signal => signal.price),
      type: 'scatter',
      mode: 'markers',
      name: 'Buy Signals',
      marker: { symbol: 'triangle-up', size: 12, color: 'green' },
      yaxis: 'y',
      hoverinfo: 'text',
      text: results.buySignals.map(signal => `Buy at ${signal.price.toFixed(2)} on ${signal.timestamp}`)
    });
  }

  if (results.sellSignals && results.sellSignals.length > 0) {
    traces.push({
      x: results.sellSignals.map(signal => signal.timestamp),
      y: results.sellSignals.map(signal => signal.price),
      type: 'scatter',
      mode: 'markers',
      name: 'Sell Signals',
      marker: { symbol: 'triangle-down', size: 12, color: 'red' },
      yaxis: 'y',
      hoverinfo: 'text',
      text: results.sellSignals.map(signal => `Sell at ${signal.price.toFixed(2)} on ${signal.timestamp}`)
    });
  }

  if (results.cumulativePNL && results.cumulativePNL.length > 0) {
    const downsampledCumulativePNL = downsampleData(results.cumulativePNL);
    traces.push({
      x: downsampledTimestamps,
      y: downsampledCumulativePNL,
      type: 'scatter',
      mode: 'lines',
      name: 'Cumulative PNL',
      line: { color: 'green', width: 2, dash: 'dot' },
      yaxis: 'y2'
    });
  }

  const layout = {
    title: `${results.strategyName || 'Strategy Results'} - ${results.symbol} (${results.timeframe})`,
    xaxis: { 
      title: 'Date',
      rangeslider: {visible: true},
      rangeselector: {
        buttons: [
          {count: 1, label: '1d', step: 'day', stepmode: 'backward'},
          {count: 7, label: '1w', step: 'day', stepmode: 'backward'},
          {count: 1, label: '1m', step: 'month', stepmode: 'backward'},
          {step: 'all'}
        ]
      }
    },
    yaxis: { title: 'Price', side: 'left' },
    yaxis2: {
      title: 'Cumulative PNL',
      overlaying: 'y',
      side: 'right',
      showgrid: false,
      zeroline: false
    },
    legend: { orientation: 'h', y: -0.2 },
    margin: { t: 80, b: 80 },
    hovermode: 'closest'
  };

  return (
    <div>
      <Plot 
        data={traces} 
        layout={layout} 
        style={{ width: '100%', height: '600px' }} 
        config={{ responsive: true }}
      />
    </div>
  );
};

StrategyResultsChart.propTypes = {
  results: PropTypes.shape({
    closePrices: PropTypes.arrayOf(PropTypes.number).isRequired,
    buySignals: PropTypes.arrayOf(PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired
    })),
    sellSignals: PropTypes.arrayOf(PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired
    })),
    cumulativePNL: PropTypes.arrayOf(PropTypes.number),
    strategyName: PropTypes.string,
    symbol: PropTypes.string.isRequired,
    timeframe: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default StrategyResultsChart;