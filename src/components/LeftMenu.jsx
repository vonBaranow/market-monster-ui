import PropTypes from 'prop-types';
import './LeftMenu.css';

/**
 * LeftMenu component for the Market Monster application.
 * 
 * This component renders a left-side navigation menu with various options
 * for navigating through the application.
 * 
 * @param {Object} props - The component props
 * @param {Function} props.onNavigate - Callback function to handle navigation
 * @returns {JSX.Element} The rendered LeftMenu component
 */
const LeftMenu = ({ onNavigate }) => {
  return (
    <nav className="left-menu">
      {/* Profile section */}
      <div className="profile">
        <h2>Market Monster</h2>
      </div>

      {/* Menu items */}
      <ul className="menu-items">
        <li onClick={() => onNavigate('market-data')}>Market Data</li>
        <li onClick={() => onNavigate('strategies')}>Strategies</li>
        <li>Download</li>
        <li>Gift Code</li>
        <li>Top Review</li>
        <li>Settings</li>
        <li>Support</li>
      </ul>

      {/* Sign out button */}
      <div className="sign-out">
        <button onClick={() => console.log('Sign out clicked')}>Sign Out</button>
      </div>
    </nav>
  );
};

// PropTypes for type checking
LeftMenu.propTypes = {
  /**
   * Callback function for handling navigation
   * @param {string} route - The route to navigate to
   */
  onNavigate: PropTypes.func.isRequired,
};

export default LeftMenu;
