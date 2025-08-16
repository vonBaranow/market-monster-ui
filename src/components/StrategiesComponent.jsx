import { useEffect, useState } from 'react';
import { fetchStrategies, calculateStrategy } from './strategyApi';
import StrategyForm from './StrategyForm';
import StrategyResultsChart from './StrategyResultsChart';
import TradeSummary from './TradeSummary';
import { useStrategyContext } from './StrategyContext';

const StrategiesComponent = () => {
  const { 
    strategies, 
    setStrategies, 
    selectedStrategy, 
    setSelectedStrategy, 
    results, 
    setResults 
  } = useStrategyContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [calculationError, setCalculationError] = useState(null);

  useEffect(() => {
    const loadStrategies = async () => {
      setIsLoading(true);
      try {
        const fetchedStrategies = await fetchStrategies();
        setStrategies(fetchedStrategies);
      } catch (error) {
        console.error('Error fetching strategies:', error);
        setError(`Failed to fetch strategies: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    loadStrategies();
  }, [setStrategies]);

  const handleCalculateStrategy = async (formData) => {
    if (!selectedStrategy) {
      setCalculationError('Please select a strategy before calculating');
      return;
    }
    setIsLoading(true);
    setCalculationError(null);
    setResults(null);
    try {
      const calculatedResults = await calculateStrategy(selectedStrategy.id, formData);
      console.log('API Response:', calculatedResults);

      // Check for required fields
      const requiredFields = [
        'timestamps', 'closePrices', 'buySignals', 'sellSignals', 'cumulativePNL', 
        'shortSMA', 'longSMA', 'totalTrades', 'winningTrades', 'losingTrades', 
        'winRate', 'averageWin', 'averageLoss', 'profitFactor', 'maxDrawdown', 
        'profitLoss', 'initialBankroll', 'finalBankroll', 'bankrollGrowth', 
        'maxDrawdownPercentage', 'tradeHistory'
      ];
      const missingFields = requiredFields.filter(field => !Object.prototype.hasOwnProperty.call(calculatedResults, field));

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields in API response: ${missingFields.join(', ')}`);
      }

      // Validate data types and lengths
      if (!Array.isArray(calculatedResults.timestamps) || calculatedResults.timestamps.length === 0) {
        throw new Error('Invalid or empty timestamps array');
      }
      if (!Array.isArray(calculatedResults.closePrices) || calculatedResults.closePrices.length === 0) {
        throw new Error('Invalid or empty closePrices array');
      }
      if (calculatedResults.timestamps.length !== calculatedResults.closePrices.length) {
        throw new Error('Mismatch between timestamps and closePrices array lengths');
      }
      if (!Array.isArray(calculatedResults.buySignals) || !Array.isArray(calculatedResults.sellSignals)) {
        throw new Error('Invalid buySignals or sellSignals array');
      }
      if (!Array.isArray(calculatedResults.tradeHistory) || calculatedResults.tradeHistory.length === 0) {
        throw new Error('Invalid or empty tradeHistory array');
      }

      setResults({
        ...calculatedResults,
        strategyName: selectedStrategy.name,
        timeframe: formData.interval,
        symbol: formData.symbol,
        startDate: formData.startDate,
        endDate: formData.endDate,
        initialBankroll: formData.initialBankroll,
        tradeSizePercentage: formData.tradeSizePercentage
      });
    } catch (error) {
      console.error('Error calculating strategy:', error);
      setCalculationError(`Failed to calculate strategy: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStrategyExplanation = (strategy) => {
    if (strategy.name.includes('SMA Crossover')) {
      return "This strategy generates buy signals when the short-term SMA crosses above the long-term SMA, and sell signals when it crosses below. It aims to capture trends while filtering out market noise.";
    }
    return strategy.description;
  };

  return (
    <div className="strategies-component">
      <h2>Trading Strategies</h2>
      {isLoading && !results && <div className="alert alert-info">Loading strategies...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!isLoading && !error && (
        <>
          <div className="mb-4">
            <label htmlFor="strategy-select" className="form-label">Select a strategy:</label>
            <select 
              id="strategy-select"
              className="form-select"
              value={selectedStrategy ? selectedStrategy.id : ''}
              onChange={(e) => {
                const selected = strategies.find(s => s.id === parseInt(e.target.value));
                setSelectedStrategy(selected);
                setResults(null);
                setCalculationError(null);
              }}
            >
              <option value="">Select a strategy</option>
              {strategies.map(strategy => (
                <option key={strategy.id} value={strategy.id}>{strategy.name}</option>
              ))}
            </select>
          </div>
          {selectedStrategy && (
            <div className="mb-4">
              <h3>Strategy Explanation</h3>
              <p>{getStrategyExplanation(selectedStrategy)}</p>
            </div>
          )}
          <StrategyForm onSubmit={handleCalculateStrategy} isLoading={isLoading} />
          {calculationError && <div className="alert alert-danger">Error: {calculationError}</div>}
          {isLoading && <div className="alert alert-info">Calculating strategy results...</div>}
          {!isLoading && results && (
            <div className="mt-5">
              <h3>Strategy Results for {results.symbol}</h3>
              <StrategyResultsChart results={results} />
              <TradeSummary results={results} />
              <div className="mt-3">
                <h4>Additional Strategy Metrics</h4>
                <ul>
                  <li>Total Trades: {results.totalTrades}</li>
                  <li>Winning Trades: {results.winningTrades}</li>
                  <li>Losing Trades: {results.losingTrades}</li>
                  <li>Win Rate: {(results.winRate * 100).toFixed(2)}%</li>
                  <li>Profit Factor: {results.profitFactor.toFixed(2)}</li>
                  <li>Max Drawdown: ${results.maxDrawdown.toFixed(2)} ({(results.maxDrawdownPercentage * 100).toFixed(2)}%)</li>
                  <li>Total Profit/Loss: ${results.profitLoss.toFixed(2)}</li>
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StrategiesComponent;
