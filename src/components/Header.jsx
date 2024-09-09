import { Navbar, Nav, Button } from 'react-bootstrap';

/**
 * Header component for the Market Monster application.
 * 
 * This component renders a navigation bar at the top of the application,
 * displaying the application name and login/logout buttons.
 * 
 * @returns {JSX.Element} The rendered Header component
 */
const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" className="justify-content-between">
      {/* Application name/logo */}
      <Navbar.Brand href="#">Market Monster</Navbar.Brand>
      
      {/* Navigation buttons */}
      <Nav>
        {/* Login button */}
        <Button variant="outline-light" className="me-2">Login</Button>
        
        {/* Logout button */}
        <Button variant="outline-light">Logout</Button>
      </Nav>
    </Navbar>
  );
};

export default Header;
