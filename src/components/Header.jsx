
import { Navbar, Nav, Button } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" className="justify-content-between">
      <Navbar.Brand href="#">Market Monster</Navbar.Brand>
      <Nav>
        <Button variant="outline-light" className="me-2">Login</Button>
        <Button variant="outline-light">Logout</Button>
      </Nav>
    </Navbar>
  );
};

export default Header;
