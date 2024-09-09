import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// Base URL for the API
const API_BASE_URL = 'http://localhost:8081';

/**
 * MarketDataDownloader component for downloading market data.
 * 
 * This component provides a form for users to input parameters for market data download,
 * and handles the download process through API calls.
 * 
 * @returns {JSX.Element} The rendered MarketDataDownloader component
 */
const MarketDataDownloader = () => {
  // State for form data
  const [formData, setFormData] = useState({
    exchange: '',
    symbol: '',
    interval: '',
    startTime: '',
    endTime: '',
  });

  // State to track if a download is in progress
  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * Handles changes in form input fields.
   * 
   * @param {Object} e - The event object
   * @param {string} e.target.name - The name of the input field
   * @param {string} e.target.value - The new value of the input field
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Handles the form submission to start the download process.
   * 
   * @param {Object} e - The event object
   */
  const handleDownload = async (e) => {
    e.preventDefault();
    setIsDownloading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/market-data/download-all`, formData);
      console.log('Download started:', response.data);
      // TODO: Show success message to the user
    } catch (error) {
      console.error('Error starting download:', error);
      // TODO: Show error message to the user
    }
  };

  /**
   * Handles the request to stop the ongoing download process.
   */
  const handleStopDownload = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/market-data/stop-download`);
      console.log('Download stopped:', response.data);
      setIsDownloading(false);
      // TODO: Show success message to the user
    } catch (error) {
      console.error('Error stopping download:', error);
      // TODO: Show error message to the user
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-4">Market Data Downloader</h5>
        <form onSubmit={handleDownload}>
          <div className="row g-3">
            {/* Exchange input field */}
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
            {/* Symbol input field */}
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
            {/* Interval input field */}
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
            {/* Start Time input field */}
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
            {/* End Time input field */}
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
          {/* Form submission buttons */}
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
      </div>
    </div>
  );
};

export default MarketDataDownloader;