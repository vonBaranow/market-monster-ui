import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import MarketDataChart from './MarketDataChart';
import { fetchStrategies, calculateStrategy } from './strategyApi';

const API_BASE_URL = 'http://localhost:8081';

const MarketDataDownloader = () => {
  const [formData, setFormData] = useState({
    exchange: '',
    symbol: '',
    interval: '',
    startTime: '',
    endTime: '',
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [marketData, setMarketData] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [strategyResults, setStrategyResults] = useState(null);

  useEffect(() => {
    const loadStrategies = async () => {
      try {
        const fetchedStrategies = await fetchStrategies();
        setStrategies(fetchedStrategies);
      } catch (error) {
        console.error('Error fetching strategies:', error);
      }
    };
    loadStrategies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    setIsDownloading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/market-data/download-all`, formData);
      console.log('Download started:', response.data);
      await fetchMarketData();
    } catch (error) {
      console.error('Error starting download:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleStopDownload = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/market-data/stop-download`);
      console.log('Download stopped:', response.data);
      setIsDownloading(false);
    } catch (error) {
      console.error('Error stopping download:', error);
    }
  };

  const fetchMarketData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/market-data`, { params: formData });
      setMarketData(response.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  const handleStrategyChange = (e) => {
    setSelectedStrategy(e.target.value);
  };

  const handleCalculateStrategy = async () => {
    if (!selectedStrategy) return;

    try {
      const results = await calculateStrategy(selectedStrategy, {
        symbol: formData.symbol,
        interval: formData.interval,
        startDate: formData.startTime,
        endDate: formData.endTime,
      });
      setStrategyResults(results);
    } catch (error) {
      console.error('Error calculating strategy:', error);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-4">Market Data Downloader</h5>
        <form onSubmit={handleDownload}>
          <div className="row g-3">
            <div className="col-md-6 col-lg-4">
              <label htmlFor="exchange" className="form-label">Exchange:</label>
              <input
                type="text"
                className="form-control"
                id="exchange"
                name="exchange"
                value={formData.exchange}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 col-lg-4">
              <label htmlFor="symbol" className="form-label">Symbol:</label>
              <input
                type="text"
                className="form-control"
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 col-lg-4">
              <label htmlFor="interval" className="form-label">Interval:</label>
              <input
                type="text"
                className="form-control"
                id="interval"
                name="interval"
                value={formData.interval}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 col-lg-6">
              <label htmlFor="startTime" className="form-label">Start Time:</label>
              <input
                type="datetime-local"
                className="form-control"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 col-lg-6">
              <label htmlFor="endTime" className="form-label">End Time:</label>
              <input
                type="datetime-local"
                className="form-control"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="mt-4 d-flex justify-content-end">
            <button type="submit" className="btn btn-primary me-2" disabled={isDownloading}>
              Start Download
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleStopDownload}
              disabled={!isDownloading}
            >
              Stop Download
            </button>
          </div>
        </form>

        <div className="mt-4">
          <h5>Strategy Calculation</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="strategy" className="form-label">Select Strategy:</label>
              <select
                className="form-select"
                id="strategy"
                value={selectedStrategy}
                onChange={handleStrategyChange}
              >
                <option value="">Choose a strategy</option>
                {strategies.map((strategy) => (
                  <option key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCalculateStrategy}
                disabled={!selectedStrategy}
              >
                Calculate Strategy
              </button>
            </div>
          </div>
        </div>

        {marketData.length > 0 && (
          <div className="mt-4">
            <h5>Market Data and Strategy Results</h5>
            <MarketDataChart marketData={marketData} strategyResults={strategyResults} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketDataDownloader;