import { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { convertToCandlestickInterval } from '../utils/timeframeConverter'; // Import the converter
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Base URL for the API
const API_BASE_URL = 'http://localhost:8081'; // Make sure this matches your backend URL

const StrategiesComponent = () => {
  const [formData, setFormData] = useState({
    exchange: '',
    symbol: '',
    interval: '1 minute',
    startTime: '',
    endTime: '',
  });

  const [marketData, setMarketData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchMarketData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Convert interval to the backend enum value
      const convertedInterval = convertToCandlestickInterval(formData.interval);

      const response = await axios.get(`${API_BASE_URL}/api/market-data`, {
        params: {
          exchange: formData.exchange,
          symbol: formData.symbol,
          interval: convertedInterval,  // Use the converted interval
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString()
        }
      });
      setMarketData(response.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
      setError(`Failed to fetch market data: ${error.response ? error.response.data : error.message}`);
    }
    setIsLoading(false);
  };

  const parseTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      return date;
    }
    console.error('Invalid date:', timestamp);
    return null;
  };

  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleString();
  };

  const renderChart = () => {
    if (marketData.length === 0) return null;

    const chartData = {
      labels: marketData.map(candle => formatDate(parseTimestamp(candle.openTime))),
      datasets: [
        {
          label: `${formData.symbol} Price`,
          data: marketData.map(candle => ({
            x: formatDate(parseTimestamp(candle.openTime)),
            y: parseFloat(candle.closePrice)
          })),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${formData.symbol} Price Chart`
        }
      },
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Price'
          }
        }
      }
    };

    return <Line data={chartData} options={options} />;
  };

  return (
    <div className="strategies-component">
      <h2>Strategies</h2>
      <form onSubmit={(e) => { e.preventDefault(); fetchMarketData(); }} className="mb-4">
        <div className="row">
          <div className="col-md-2">
            <label htmlFor="exchange" className="form-label">Exchange</label>
            <input type="text" className="form-control" id="exchange" name="exchange" value={formData.exchange} onChange={handleInputChange} required />
          </div>
          <div className="col-md-2">
            <label htmlFor="symbol" className="form-label">Symbol</label>
            <input type="text" className="form-control" id="symbol" name="symbol" value={formData.symbol} onChange={handleInputChange} required />
          </div>
          <div className="col-md-2">
            <label htmlFor="interval" className="form-label">Interval</label>
            <select className="form-select" id="interval" name="interval" value={formData.interval} onChange={handleInputChange}>
              <option value="1 minute">1 minute</option>
              <option value="3 minutes">3 minutes</option>
              <option value="5 minutes">5 minutes</option>
              <option value="15 minutes">15 minutes</option>
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="2 hours">2 hours</option>
              <option value="4 hours">4 hours</option>
              <option value="6 hours">6 hours</option>
              <option value="8 hours">8 hours</option>
              <option value="12 hours">12 hours</option>
              <option value="1 day">1 day</option>
              <option value="3 days">3 days</option>
              <option value="1 week">1 week</option>
              <option value="1 month">1 month</option>
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="startTime" className="form-label">Start Time</label>
            <input type="datetime-local" className="form-control" id="startTime" name="startTime" value={formData.startTime} onChange={handleInputChange} required />
          </div>
          <div className="col-md-3">
            <label htmlFor="endTime" className="form-label">End Time</label>
            <input type="datetime-local" className="form-control" id="endTime" name="endTime" value={formData.endTime} onChange={handleInputChange} required />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch Data'}
        </button>
      </form>
      {error && <div className="alert alert-danger">{error}</div>}
      {isLoading && <div className="alert alert-info">Loading data...</div>}
      {!isLoading && marketData.length > 0 && renderChart()}
    </div>
  );
};

export default StrategiesComponent;
