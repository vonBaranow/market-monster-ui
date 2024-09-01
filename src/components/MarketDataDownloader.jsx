import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const MarketDataDownloader = () => {
  const [formData, setFormData] = useState({
    exchange: '',
    symbol: '',
    interval: '',
    startTime: '',
    endTime: '',
  });
  const [isDownloading, setIsDownloading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    setIsDownloading(true);
    try {
      const response = await axios.post('/api/market-data/download-all', formData);
      console.log('Download started:', response.data);
      // TODO: Show success message to the user
    } catch (error) {
      console.error('Error starting download:', error);
      // TODO: Show error message to the user
    }
  };

  const handleStopDownload = async () => {
    try {
      const response = await axios.post('/api/market-data/stop-download');
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
      </div>
    </div>
  );
};

export default MarketDataDownloader;