import PropTypes from 'prop-types';

const TradeSummary = ({ results }) => {
  if (!results || typeof results !== 'object') {
    return <div>Error: Invalid trade summary data</div>;
  }

  const formatNumber = (num, decimalPlaces = 2) => {
    return Number.isFinite(num) ? num.toFixed(decimalPlaces) : 'N/A';
  };

  const formatPercentage = (num) => {
    return Number.isFinite(num) ? `${(num * 100).toFixed(2)}%` : 'N/A';
  };

  return (
    <div className="trade-summary">
      <h4>Trade Summary</h4>
      <ul>
        <li>Total Trades: {results.totalTrades || 0}</li>
        <li>Winning Trades: {results.winningTrades || 0}</li>
        <li>Losing Trades: {results.losingTrades || 0}</li>
        <li>Win Rate: {formatPercentage(results.winRate)}</li>
        <li>Average Win: {formatNumber(results.averageWin)}</li>
        <li>Average Loss: {formatNumber(results.averageLoss)}</li>
        <li>Profit Factor: {formatNumber(results.profitFactor)}</li>
        <li>Maximum Drawdown: {formatPercentage(results.maxDrawdown)}</li>
        <li>Overall Profit/Loss: {formatNumber(results.profitLoss)}</li>
      </ul>
    </div>
  );
};

TradeSummary.propTypes = {
  results: PropTypes.shape({
    totalTrades: PropTypes.number,
    winningTrades: PropTypes.number,
    losingTrades: PropTypes.number,
    winRate: PropTypes.number,
    averageWin: PropTypes.number,
    averageLoss: PropTypes.number,
    profitFactor: PropTypes.number,
    maxDrawdown: PropTypes.number,
    profitLoss: PropTypes.number
  }).isRequired
};

export default TradeSummary;