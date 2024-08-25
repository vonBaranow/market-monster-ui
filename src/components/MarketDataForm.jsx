// Import necessary libraries and hooks
import { useState } from 'react';
import PropTypes from 'prop-types';

// Define the functional component for the form
const MarketDataForm = ({ onSubmit }) => {
  // State management for form fields
  const [exchange, setExchange] = useState('binance');
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('1h');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    onSubmit({ exchange, symbol, timeframe, startTime, endTime });
  };

  // JSX for rendering the form
  return (
    <form onSubmit={handleSubmit} className="p-3 bg-light rounded">
      {/* Exchange Input */}
      <div className="form-group mb-3">
        <label>Exchange</label>
        <input
          type="text"
          className="form-control"
          value={exchange}
          onChange={(e) => setExchange(e.target.value)}
        />
      </div>

      {/* Symbol Input */}
      <div className="form-group mb-3">
        <label>Symbol</label>
        <input
          type="text"
          className="form-control"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
      </div>

      {/* Timeframe Input */}
      <div className="form-group mb-3">
        <label>Timeframe</label>
        <input
          type="text"
          className="form-control"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        />
      </div>

      {/* Start Time Input */}
      <div className="form-group mb-3">
        <label>Start Time</label>
        <input
          type="datetime-local"
          className="form-control"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      {/* End Time Input */}
      <div className="form-group mb-3">
        <label>End Time</label>
        <input
          type="datetime-local"
          className="form-control"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary w-100">
        Get Market Data
      </button>
    </form>
  );
};

// PropTypes validation
MarketDataForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

// Export the component for use in other parts of the app
export default MarketDataForm;
