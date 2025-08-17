import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

const API_BASE_URL = 'http://localhost:8081';

const MarketDataDownloader = () => {
  const [formData, setFormData] = useState({
    exchange: 'BINANCE',
    symbol: '',
    interval: '1m',
    startTime: new Date(new Date().getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    endTime: new Date(),
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [marketData, setMarketData] = useState([]);
  const [progress, setProgress] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  // Progress polling effect
  useEffect(() => {
    if (!isDownloading) return;
    
    const pollProgress = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/market-data/historical/download-progress`);
        setProgress(data);
      } catch (error) {
        console.error('Progress fetch error:', error);
      }
    };

    const intervalId = setInterval(pollProgress, 1500);
    return () => clearInterval(intervalId);
  }, [isDownloading]);

  // Form validation function
  const validateForm = (formData) => {
    const errors = [];
    
    if (!/^[A-Z]+$/.test(formData.symbol)) {
      errors.push('Symbol must be uppercase letters like BTCUSDT');
    }
    
    if (!['1m','3m','5m','15m','30m','1h','2h','4h','6h','8h','12h','1d','3d','1w','1M'].includes(formData.interval)) {
      errors.push('Invalid interval. Use: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M');
    }
    
    if (formData.startTime && formData.endTime && new Date(formData.startTime) >= new Date(formData.endTime)) {
      errors.push('Start time must be before end time');
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleDateTimeChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    // Clear validation errors when user changes datetime
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  // Available options
  const exchanges = ['BINANCE', 'COINBASE', 'KRAKEN'];
  const intervals = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M'];
  const popularSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 'XRPUSDT', 'DOTUSDT', 'DOGEUSDT'];

  const handleDownload = async (e) => {
    e.preventDefault();
    
    // Validate form before starting download
    const errors = validateForm(formData);
    setValidationErrors(errors);
    
    if (errors.length > 0) {
      return;
    }
    
    setIsDownloading(true);
    setProgress(null);
    
    try {
      const params = new URLSearchParams({
        exchange: formData.exchange,
        symbol: formData.symbol,
        timeframe: 'raw',
        interval: formData.interval,
        ...(formData.startTime && { startFrom: formData.startTime.toISOString() })
      });
      const response = await axios.get(`${API_BASE_URL}/api/market-data/historical/download-all?${params}`);
      console.log('Download started:', response.data);
      await fetchMarketData();
    } catch (error) {
      console.error('Error starting download:', error);
      setValidationErrors([`Download failed: ${error.response?.data?.message || error.message}`]);
    } finally {
      setIsDownloading(false);
      setProgress(null);
    }
  };

  const handleStopDownload = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/market-data/historical/stop-download`);
      console.log('Download stopped:', response.data);
      setIsDownloading(false);
    } catch (error) {
      console.error('Error stopping download:', error);
    }
  };

  const fetchMarketData = async () => {
    try {
      const params = {
        exchange: formData.exchange,
        symbol: formData.symbol,
        interval: formData.interval,
        startTime: formData.startTime.toISOString(),
        endTime: formData.endTime.toISOString()
      };
      const response = await axios.get(`${API_BASE_URL}/api/market-data`, { params });
      setMarketData(response.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
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
              <select
                className="form-select"
                id="exchange"
                name="exchange"
                value={formData.exchange}
                onChange={handleInputChange}
                required
              >
                {exchanges.map(exchange => (
                  <option key={exchange} value={exchange}>{exchange}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 col-lg-4">
              <label htmlFor="symbol" className="form-label">Symbol:</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="symbol"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  placeholder="Enter symbol (e.g., BTCUSDT)"
                  required
                />
                <select
                  className="form-select"
                  style={{maxWidth: '120px'}}
                  value={formData.symbol}
                  onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                >
                  <option value="">Popular</option>
                  {popularSymbols.map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <label htmlFor="interval" className="form-label">Interval:</label>
              <select
                className="form-select"
                id="interval"
                name="interval"
                value={formData.interval}
                onChange={handleInputChange}
                required
              >
                {intervals.map(interval => (
                  <option key={interval} value={interval}>{interval}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 col-lg-6">
              <label className="form-label">Start Time:</label>
              <div className="d-block">
                <DateTimePicker
                  onChange={(value) => handleDateTimeChange('startTime', value)}
                  value={formData.startTime}
                  className="form-control"
                  format="y-MM-dd HH:mm"
                  clearIcon={null}
                  calendarIcon={null}
                />
              </div>
            </div>
            <div className="col-md-6 col-lg-6">
              <label className="form-label">End Time:</label>
              <div className="d-block">
                <DateTimePicker
                  onChange={(value) => handleDateTimeChange('endTime', value)}
                  value={formData.endTime}
                  className="form-control"
                  format="y-MM-dd HH:mm"
                  clearIcon={null}
                  calendarIcon={null}
                />
              </div>
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

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mt-3">
            <div className="alert alert-danger">
              <ul className="mb-0">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Progress Display */}
        {isDownloading && progress && (
          <div className="mt-3">
            <div className="card bg-light">
              <div className="card-body">
                <h6 className="card-title">Download Progress</h6>
                <div className="mb-2">
                  <strong>Symbol:</strong> {progress.symbol}
                </div>
                <div className="mb-2">
                  <strong>Fetched:</strong> {progress.totalCandlesProcessed} candles
                </div>
                <div className="mb-2">
                  <strong>Current Time:</strong> {progress.currentTime ? new Date(progress.currentTime).toLocaleString() : 'N/A'}
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar progress-bar-striped progress-bar-animated" 
                    role="progressbar" 
                    style={{width: '100%'}}
                  >
                    Downloading...
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {marketData.length > 0 && (
          <div className="mt-4">
            <div className="alert alert-success">
              <strong>Download Complete!</strong> Successfully downloaded {marketData.length} data points.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketDataDownloader;
