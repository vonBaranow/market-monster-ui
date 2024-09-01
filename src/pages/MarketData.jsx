import MarketDataDownloader from '../components/MarketDataDownloader';
import 'bootstrap/dist/css/bootstrap.min.css';

const MarketData = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h2 className="my-4">Market Data</h2>
          <MarketDataDownloader />
        </div>
      </div>
    </div>
  );
};

export default MarketData;