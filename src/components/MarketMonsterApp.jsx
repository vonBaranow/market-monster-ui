import { useState } from 'react';
import MarketDataForm from './MarketDataForm';
import MarketChart from './MarketChart';

const MarketMonsterApp = () => {
  const [marketData, setMarketData] = useState([]);

  const fetchMarketData = async (params) => {
    console.log("Fetching market data with params:", params);
    try {
      const response = await fetch(
        `http://localhost:8080/api/market-data?exchange=${params.exchange}&symbol=${params.symbol}&startTime=${params.startTime}&endTime=${params.endTime}`
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Market data received:", data);
      setMarketData(data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="row w-100">
        <h1 className="text-center mb-4">Market Monster</h1>
        <div className="col-lg-4 col-md-6 mx-auto">
          <MarketDataForm onSubmit={fetchMarketData} />
        </div>
        <div className="col-lg-8 col-md-12">
          {marketData.length > 0 && (
            <div className="card p-3 shadow-sm">
              <MarketChart data={marketData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketMonsterApp;
