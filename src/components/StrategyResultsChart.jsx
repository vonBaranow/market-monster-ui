import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import { useState, useEffect } from 'react';

const StrategyResultsChart = ({ results }) => {
  const [showClosePrice, setShowClosePrice] = useState(true);
  const [showBuySignals, setShowBuySignals] = useState(true);
  const [showSellSignals, setShowSellSignals] = useState(true);
  const [showCumulativePNL, setShowCumulativePNL] = useState(true);
  const [showShortSMA, setShowShortSMA] = useState(true);
  const [showLongSMA, setShowLongSMA] = useState(true);
  const [traces, setTraces] = useState([]);
  const [layout, setLayout] = useState({});
  const [isDataValid, setIsDataValid] = useState(true);

  useEffect(() => {
    if (
      !results ||
      !Array.isArray(results.closePrices) ||
      !Array.isArray(results.timestamps)
    ) {
      console.error('Invalid results data:', results);
      setIsDataValid(false);
      return;
    }

    // Check for duplicate timestamps
    const checkTimestamps = (timestamps) => {
      const seen = new Set();
      for (let i = 0; i < timestamps.length; i++) {
        if (seen.has(timestamps[i])) {
          console.error('Duplicate timestamp found at index:', i);
          return false;
        }
        seen.add(timestamps[i]);
      }
      return true;
    };

    if (!checkTimestamps(results.timestamps)) {
      console.error('Timestamps contain duplicates or are unsorted.');
      setIsDataValid(false);
      return;
    }

    setIsDataValid(true);
    console.log('Chart data:', results);

    const MAX_POINTS = 1000;

    const downsampleData = (data) => {
      const length = data.length;
      if (length <= MAX_POINTS)
        return { data, indices: data.map((_, idx) => idx) };
      const factor = length / MAX_POINTS;
      const downsampledData = [];
      const indices = [];
      for (let i = 0; i < MAX_POINTS; i++) {
        const idx = Math.floor(i * factor);
        downsampledData.push(data[idx]);
        indices.push(idx);
      }
      return { data: downsampledData, indices };
    };

    const isValidNumber = (value) =>
      typeof value === 'number' && isFinite(value) && !isNaN(value);
    const cleanData = (data) =>
      data.map((value) => (isValidNumber(value) ? value : null));

    const { data: downsampledTimestamps, indices } = downsampleData(results.timestamps);

    // Clean and downsample data arrays
    const downsampledClosePrices = cleanData(indices.map((idx) => results.closePrices[idx]));
    const downsampledShortSMA = cleanData(indices.map((idx) => results.shortSMA[idx]));
    const downsampledLongSMA = cleanData(indices.map((idx) => results.longSMA[idx]));
    const downsampledCumulativePNL = cleanData(indices.map((idx) => results.cumulativePNL[idx]));

    // Verify data lengths
    const dataLengths = {
      timestamps: downsampledTimestamps.length,
      closePrices: downsampledClosePrices.length,
      shortSMA: downsampledShortSMA.length,
      longSMA: downsampledLongSMA.length,
      cumulativePNL: downsampledCumulativePNL.length,
    };
    console.log('Data lengths after downsampling:', dataLengths);

    // Ensure all data arrays have the same length
    const allSameLength = Object.values(dataLengths).every(
      (length) => length === dataLengths.timestamps
    );
    if (!allSameLength) {
      console.error('Data arrays have mismatched lengths:', dataLengths);
      setIsDataValid(false);
      return;
    }

    const newTraces = [];

    // Plot Close Price
    if (showClosePrice) {
      newTraces.push({
        x: downsampledTimestamps,
        y: downsampledClosePrices,
        type: 'scatter',
        mode: 'lines',
        name: 'Close Price',
        line: { color: 'blue', width: 2 },
        yaxis: 'y',
        hovertemplate: '%{x}<br>Close: %{y}<br>',
        connectgaps: false,
      });
    }

    // Plot Short SMA
    if (showShortSMA) {
      newTraces.push({
        x: downsampledTimestamps,
        y: downsampledShortSMA,
        type: 'scatter',
        mode: 'lines',
        name: 'Short SMA',
        line: { color: 'orange', width: 1.5 },
        yaxis: 'y',
        connectgaps: false,
      });
    }

    // Plot Long SMA
    if (showLongSMA) {
      newTraces.push({
        x: downsampledTimestamps,
        y: downsampledLongSMA,
        type: 'scatter',
        mode: 'lines',
        name: 'Long SMA',
        line: { color: 'purple', width: 1.5 },
        yaxis: 'y',
        connectgaps: false,
      });
    }

    // Plot Buy Signals
    if (showBuySignals && results.buySignals && results.buySignals.length > 0) {
      newTraces.push({
        x: results.buySignals.map((signal) => signal.timestamp),
        y: results.buySignals.map((signal) => signal.price),
        type: 'scatter',
        mode: 'markers',
        name: 'Buy Signals',
        marker: { symbol: 'triangle-up', size: 12, color: 'green' },
        yaxis: 'y',
        hoverinfo: 'text',
        text: results.buySignals.map(
          (signal) => `Buy at ${signal.price.toFixed(2)} on ${signal.timestamp}`
        ),
      });
    }

    // Plot Sell Signals
    if (showSellSignals && results.sellSignals && results.sellSignals.length > 0) {
      newTraces.push({
        x: results.sellSignals.map((signal) => signal.timestamp),
        y: results.sellSignals.map((signal) => signal.price),
        type: 'scatter',
        mode: 'markers',
        name: 'Sell Signals',
        marker: { symbol: 'triangle-down', size: 12, color: 'red' },
        yaxis: 'y',
        hoverinfo: 'text',
        text: results.sellSignals.map(
          (signal) => `Sell at ${signal.price.toFixed(2)} on ${signal.timestamp}`
        ),
      });
    }

    // Plot Cumulative PNL
    if (showCumulativePNL) {
      newTraces.push({
        x: downsampledTimestamps,
        y: downsampledCumulativePNL,
        type: 'scatter',
        mode: 'lines',
        name: 'Cumulative PNL',
        line: { color: 'green', width: 2, dash: 'dot' },
        yaxis: 'y2',
        connectgaps: false,
      });
    }

    setTraces(newTraces);

    setLayout({
      title: `${results.strategyName || 'Strategy Results'} - ${results.symbol} (${results.timeframe})`,
      xaxis: {
        title: 'Date',
        rangeslider: { visible: true },
        type: 'date',
        automargin: true,
      },
      yaxis: { title: 'Price', side: 'left', automargin: true },
      yaxis2: {
        title: 'Cumulative PNL',
        overlaying: 'y',
        side: 'right',
        showgrid: false,
        zeroline: false,
        automargin: true,
      },
      legend: { orientation: 'h', y: -0.3 },
      margin: { t: 80, b: 100 },
      hovermode: 'x unified',
    });
  }, [
    results,
    showClosePrice,
    showBuySignals,
    showSellSignals,
    showCumulativePNL,
    showShortSMA,
    showLongSMA,
  ]);

  if (!isDataValid) {
    return <div>Error: Invalid data for chart rendering</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>
          <input
            type="checkbox"
            checked={showClosePrice}
            onChange={() => setShowClosePrice(!showClosePrice)}
          />
          Close Price
        </label>
        <label style={{ marginRight: '10px' }}>
          <input
            type="checkbox"
            checked={showShortSMA}
            onChange={() => setShowShortSMA(!showShortSMA)}
          />
          Short SMA
        </label>
        <label style={{ marginRight: '10px' }}>
          <input
            type="checkbox"
            checked={showLongSMA}
            onChange={() => setShowLongSMA(!showLongSMA)}
          />
          Long SMA
        </label>
        <label style={{ marginRight: '10px' }}>
          <input
            type="checkbox"
            checked={showBuySignals}
            onChange={() => setShowBuySignals(!showBuySignals)}
          />
          Buy Signals
        </label>
        <label style={{ marginRight: '10px' }}>
          <input
            type="checkbox"
            checked={showSellSignals}
            onChange={() => setShowSellSignals(!showSellSignals)}
          />
          Sell Signals
        </label>
        <label>
          <input
            type="checkbox"
            checked={showCumulativePNL}
            onChange={() => setShowCumulativePNL(!showCumulativePNL)}
          />
          Cumulative PNL
        </label>
      </div>
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
    timestamps: PropTypes.arrayOf(PropTypes.string).isRequired,
    closePrices: PropTypes.arrayOf(PropTypes.number).isRequired,
    buySignals: PropTypes.arrayOf(
      PropTypes.shape({
        timestamp: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
      })
    ),
    sellSignals: PropTypes.arrayOf(
      PropTypes.shape({
        timestamp: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
      })
    ),
    cumulativePNL: PropTypes.arrayOf(PropTypes.number),
    shortSMA: PropTypes.arrayOf(PropTypes.number),
    longSMA: PropTypes.arrayOf(PropTypes.number),
    strategyName: PropTypes.string,
    symbol: PropTypes.string.isRequired,
    timeframe: PropTypes.string.isRequired,
  }).isRequired,
};

export default StrategyResultsChart;
