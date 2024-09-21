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

    setIsDataValid(true);
    console.log('Chart data:', results);

    const parseISODate = (dateString) => new Date(dateString);
    const timestamps = results.timestamps.map(parseISODate);

    const newTraces = [];

    // Plot Close Price
    if (showClosePrice) {
      newTraces.push({
        x: timestamps,
        y: results.closePrices,
        type: 'scatter',
        mode: 'lines',
        name: 'Close Price',
        line: { color: 'blue', width: 2 },
        yaxis: 'y',
        hovertemplate: '%{x}<br>Close: %{y}<br>',
      });
    }

    // Plot Short SMA
    if (showShortSMA) {
      const shortSMAData = results.shortSMA.map((value, index) => ({
        x: timestamps[index],
        y: value
      })).filter(point => point.y !== null);

      newTraces.push({
        x: shortSMAData.map(point => point.x),
        y: shortSMAData.map(point => point.y),
        type: 'scatter',
        mode: 'lines',
        name: 'Short SMA',
        line: { color: 'orange', width: 1.5 },
        yaxis: 'y',
      });
    }

    // Plot Long SMA
    if (showLongSMA) {
      const longSMAData = results.longSMA.map((value, index) => ({
        x: timestamps[index],
        y: value
      })).filter(point => point.y !== null);

      newTraces.push({
        x: longSMAData.map(point => point.x),
        y: longSMAData.map(point => point.y),
        type: 'scatter',
        mode: 'lines',
        name: 'Long SMA',
        line: { color: 'purple', width: 1.5 },
        yaxis: 'y',
      });
    }

    // Plot Buy Signals
    if (showBuySignals && results.buySignals && results.buySignals.length > 0) {
      newTraces.push({
        x: results.buySignals.map((signal) => parseISODate(signal.timestamp)),
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
        x: results.sellSignals.map((signal) => parseISODate(signal.timestamp)),
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
        x: timestamps,
        y: results.cumulativePNL,
        type: 'scatter',
        mode: 'lines',
        name: 'Cumulative PNL',
        line: { color: 'green', width: 2, dash: 'dot' },
        yaxis: 'y2',
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
      <div style={{ marginTop: '20px' }}>
        <h3>Trade Statistics</h3>
        <ul>
          <li>Total Trades: {results.totalTrades}</li>
          <li>Winning Trades: {results.winningTrades}</li>
          <li>Losing Trades: {results.losingTrades}</li>
          <li>Win Rate: {(results.winRate * 100).toFixed(2)}%</li>
          <li>Average Win: ${results.averageWin.toFixed(2)}</li>
          <li>Average Loss: ${results.averageLoss.toFixed(2)}</li>
          <li>Profit Factor: {results.profitFactor.toFixed(2)}</li>
          <li>Max Drawdown: ${results.maxDrawdown.toFixed(2)}</li>
        </ul>
      </div>
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
    totalTrades: PropTypes.number.isRequired,
    winningTrades: PropTypes.number.isRequired,
    losingTrades: PropTypes.number.isRequired,
    winRate: PropTypes.number.isRequired,
    averageWin: PropTypes.number.isRequired,
    averageLoss: PropTypes.number.isRequired,
    profitFactor: PropTypes.number.isRequired,
    maxDrawdown: PropTypes.number.isRequired,
  }).isRequired,
};

export default StrategyResultsChart;
