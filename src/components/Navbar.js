import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import { Navbar as BootstrapNavbar, Nav, Button, Container } from 'react-bootstrap';

const CustomNavbar = () => {
    const { logout, token } = useAuth();
    const navigate = useNavigate();

    return (
        <BootstrapNavbar bg="light" expand="lg" className="mb-3">
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/" className="fs-3">DL Medical</BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" className="fs-5">Home</Nav.Link>
                        <Nav.Link as={Link} to="/doctors" className="fs-5">Our Doctors</Nav.Link>
                        <Nav.Link as={Link} to="/patients" className="fs-5">Our Patients</Nav.Link>
                        <Nav.Link as={Link} to="/prescriptions" className="fs-5">Prescriptions</Nav.Link> {/* Adding the link for Prescriptions */}
                        {!token && (
                            <Nav.Link as={Link} to="/register" className="fs-5">Register</Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        {token ? (
                            <Button variant="outline-danger" className="fs-5" onClick={() => { logout(); navigate('/login'); }}>Logout</Button>
                        ) : (
                            <Nav.Link as={Link} to="/login" className="fs-5">Login</Nav.Link>
                        )}
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
}

export default CustomNavbar;