import { useState } from 'react';
import './App.css';
import LeftMenu from './components/LeftMenu';
import MarketData from './pages/MarketData';
import Strategies from './pages/Strategies';

function App() {
  const [currentPage, setCurrentPage] = useState('market-data');

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'market-data':
        return <MarketData />;
      case 'strategies':
        return <Strategies />;
      default:
        return <MarketData />;
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <LeftMenu onNavigate={handleNavigation} />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
