import PropTypes from 'prop-types';

const TradeSummary = ({ results }) => {
  if (!results || typeof results !== 'object') {
    console.error('Invalid trade summary data:', results);
    return <div>Error: Invalid trade summary data</div>;
  }

  const formatNumber = (num, decimalPlaces = 2) => {
    if (!Number.isFinite(num)) {
      console.warn(`Invalid number for formatting: ${num}`);
      return 'N/A';
    }
    return num.toLocaleString(undefined, { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces });
  };

  const formatPercentage = (num) => {
    if (!Number.isFinite(num)) {
      console.warn(`Invalid number for percentage formatting: ${num}`);
      return 'N/A';
    }
    // Handle both decimal (e.g., 0.5) and whole number (e.g., 50) inputs
    const percentage = num > 1 ? num : num * 100;
    return `${percentage.toFixed(2)}%`;
  };

  const formatCurrency = (num) => {
    if (!Number.isFinite(num)) {
      console.warn(`Invalid number for currency formatting: ${num}`);
      return 'N/A';
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  console.log('Trade summary data:', results);

  return (
    <div className="trade-summary">
      <h4>Trade Summary</h4>
      <table className="table table-striped">
        <tbody>
          <tr>
            <td>Initial Bankroll:</td>
            <td>{formatCurrency(results.initialBankroll)}</td>
          </tr>
          <tr>
            <td>Final Bankroll:</td>
            <td>{formatCurrency(results.finalBankroll)}</td>
          </tr>
          <tr>
            <td>Total Return:</td>
            <td>{formatPercentage(results.bankrollGrowth)}</td>
          </tr>
          <tr>
            <td>Total Trades:</td>
            <td>{results.totalTrades || 0}</td>
          </tr>
          <tr>
            <td>Winning Trades:</td>
            <td>{results.winningTrades || 0}</td>
          </tr>
          <tr>
            <td>Losing Trades:</td>
            <td>{results.losingTrades || 0}</td>
          </tr>
          <tr>
            <td>Win Rate:</td>
            <td>{formatPercentage(results.winRate)}</td>
          </tr>
          <tr>
            <td>Average Win:</td>
            <td>{formatCurrency(results.averageWin)}</td>
          </tr>
          <tr>
            <td>Average Loss:</td>
            <td>{formatCurrency(results.averageLoss)}</td>
          </tr>
          <tr>
            <td>Profit Factor:</td>
            <td>{formatNumber(results.profitFactor)}</td>
          </tr>
          <tr>
            <td>Maximum Drawdown:</td>
            <td>{formatPercentage(results.maxDrawdownPercentage)}</td>
          </tr>
          <tr>
            <td>Overall Profit/Loss:</td>
            <td>{formatCurrency(results.profitLoss)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

TradeSummary.propTypes = {
  results: PropTypes.shape({
    initialBankroll: PropTypes.number,
    finalBankroll: PropTypes.number,
    bankrollGrowth: PropTypes.number,
    totalTrades: PropTypes.number,
    winningTrades: PropTypes.number,
    losingTrades: PropTypes.number,
    winRate: PropTypes.number,
    averageWin: PropTypes.number,
    averageLoss: PropTypes.number,
    profitFactor: PropTypes.number,
    maxDrawdownPercentage: PropTypes.number,
    profitLoss: PropTypes.number
  }).isRequired
};

export default TradeSummary;