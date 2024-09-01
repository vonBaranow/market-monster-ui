import PropTypes from 'prop-types';
import './LeftMenu.css';

const LeftMenu = ({ onNavigate }) => {
  return (
    <nav className="left-menu">
      <div className="profile">
        <h2>Market Monster</h2>
      </div>
      <ul className="menu-items">
        <li onClick={() => onNavigate('market-data')}>Market Data</li>
        <li onClick={() => onNavigate('strategies')}>Strategies</li>
        <li>Download</li>
        <li>Gift Code</li>
        <li>Top Review</li>
        <li>Settings</li>
        <li>Support</li>
      </ul>
      <div className="sign-out">
        <button onClick={() => console.log('Sign out clicked')}>Sign Out</button>
      </div>
    </nav>
  );
};

LeftMenu.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};

export default LeftMenu;
