import { useState, useEffect } from 'react';
import { fetchStrategies, calculateStrategy } from '../components/strategyApi';
import MarketDataDownloader from '../components/MarketDataDownloader';
import StrategyResultsChart from '../components/StrategyResultsChart';
import 'bootstrap/dist/css/bootstrap.min.css';

const MarketData = () => {
  const [strategies, setStrategies] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [symbol, setSymbol] = useState('');
  const [interval, setInterval] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStrategies = async () => {
      try {
        const fetchedStrategies = await fetchStrategies();
        setStrategies(fetchedStrategies);
      } catch {
        setError('Failed to load strategies');
      }
    };
    loadStrategies();
  }, []);

  const handleCalculate = async () => {
    if (!selectedStrategy || !symbol || !interval || !startDate || !endDate) {
      setError('Please fill in all fields');
      return;
    }
    try {
      const data = await calculateStrategy(selectedStrategy, { symbol, interval, startDate, endDate });
      setResults(data);
      setError('');
    } catch {
      setError('Failed to calculate strategy results');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h2 className="my-4">Market Data and Strategy Analysis</h2>
          <MarketDataDownloader />
          <div className="mt-4">
            <h3>Strategy Analysis</h3>
            <div className="mb-3">
              <select 
                className="form-select"
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
              >
                <option value="">Select a strategy</option>
                {strategies.map(strategy => (
                  <option key={strategy.id} value={strategy.id}>{strategy.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <input 
                type="text" 
                className="form-control"
                placeholder="Symbol" 
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input 
                type="text" 
                className="form-control"
                placeholder="Interval" 
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input 
                type="date" 
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input 
                type="date" 
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handleCalculate}>Calculate</button>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
          {results && (
            <div className="mt-4">
              <h3>Strategy Results</h3>
              <StrategyResultsChart results={results} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketData;