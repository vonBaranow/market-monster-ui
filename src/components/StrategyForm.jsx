import { useState } from 'react';
import PropTypes from 'prop-types';

const StrategyForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    interval: 'ONE_MINUTE',
    startDate: '',
    endDate: '',
    initialBankroll: 10000, // Default value
    tradeSizePercentage: 2, // Default value
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      initialBankroll: parseFloat(formData.initialBankroll),
      tradeSizePercentage: parseFloat(formData.tradeSizePercentage),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="row">
        <div className="col-md-3">
          <label htmlFor="symbol" className="form-label">Symbol</label>
          <input type="text" className="form-control" id="symbol" name="symbol" value={formData.symbol} onChange={handleInputChange} required />
        </div>
        <div className="col-md-3">
          <label htmlFor="interval" className="form-label">Interval</label>
          <select className="form-select" id="interval" name="interval" value={formData.interval} onChange={handleInputChange}>
            <option value="ONE_MINUTE">1 minute</option>
            <option value="THREE_MINUTES">3 minutes</option>
            <option value="FIVE_MINUTES">5 minutes</option>
            <option value="FIFTEEN_MINUTES">15 minutes</option>
            <option value="HALF_HOURLY">30 minutes</option>
            <option value="HOURLY">1 hour</option>
            <option value="TWO_HOURLY">2 hours</option>
            <option value="FOUR_HOURLY">4 hours</option>
            <option value="SIX_HOURLY">6 hours</option>
            <option value="EIGHT_HOURLY">8 hours</option>
            <option value="TWELVE_HOURLY">12 hours</option>
            <option value="DAILY">1 day</option>
            <option value="THREE_DAILY">3 days</option>
            <option value="WEEKLY">1 week</option>
            <option value="MONTHLY">1 month</option>
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="startDate" className="form-label">Start Date</label>
          <input type="datetime-local" className="form-control" id="startDate" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
        </div>
        <div className="col-md-3">
          <label htmlFor="endDate" className="form-label">End Date</label>
          <input type="datetime-local" className="form-control" id="endDate" name="endDate" value={formData.endDate} onChange={handleInputChange} required />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-6">
          <label htmlFor="initialBankroll" className="form-label">Initial Bankroll ($)</label>
          <input
            type="number"
            className="form-control"
            id="initialBankroll"
            name="initialBankroll"
            value={formData.initialBankroll}
            onChange={handleInputChange}
            min="0.01"
            step="0.01"
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="tradeSizePercentage" className="form-label">Trade Size (%)</label>
          <input
            type="number"
            className="form-control"
            id="tradeSizePercentage"
            name="tradeSizePercentage"
            value={formData.tradeSizePercentage}
            onChange={handleInputChange}
            min="0.01"
            max="100"
            step="0.01"
            required
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-3" disabled={isLoading}>
        {isLoading ? 'Calculating...' : 'Calculate Strategy'}
      </button>
    </form>
  );
};

StrategyForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default StrategyForm;