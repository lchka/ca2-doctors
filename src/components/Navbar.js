import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar as BootstrapNavbar, Nav, Button, Container, Form } from "react-bootstrap";
import { FaHome, FaUserMd, FaUser, FaSearch, FaCalendarAlt } from "react-icons/fa";
import { useAuth } from "../utils/useAuth";
import "../styles/NavBar.scss";
import "../styles/Home.scss";

import logoImage from "../images/navlogono.png";

const CustomNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, token } = useAuth();

  const [activeLink, setActiveLink] = useState(location.pathname);
  const [searchQuery, setSearchQuery] = useState("");
  const [logoAnimation, setLogoAnimation] = useState(false); // Logo animation state
  const [linksAnimation, setLinksAnimation] = useState(false); // Links fade-in animation state

  useEffect(() => {
    // Trigger both animations when the navbar mounts
    setLogoAnimation(true);
    setTimeout(() => setLinksAnimation(true), 200); // Delay the link animations slightly
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim() !== "") {
      // Redirect to a search results page or make an API call here
      console.log("Searching for:", searchQuery);
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <BootstrapNavbar
      expand="lg"
      className="navbar-dark gradient-custom sticky-top"
    >
      <Container fluid>
        {/* Navbar Brand (Logo) */}
        <BootstrapNavbar.Brand as={Link} to="/" className={logoAnimation ? "logo-slide-in" : ""}>
          <img src={logoImage} alt="DL Medical Logo" className="d-inline-block align-top" height="60" />
        </BootstrapNavbar.Brand>

        {/* Navbar Toggler */}
        <BootstrapNavbar.Toggle aria-controls="navbarSupportedContent" />

        <BootstrapNavbar.Collapse id="navbarSupportedContent">
          {/* Left Links */}
          <Nav className="d-flex flex-row mt-3 mt-lg-0">
            <Nav.Item className={`text-center animate-button mx-2 mx-lg-1 ${linksAnimation ? "link-fade-in" : ""}`}>
              <Nav.Link
                as={Link}
                to="/"
                className={`nav-link ${activeLink === "/" ? "active-link" : ""}`}
                onClick={() => setActiveLink("/")}
              >
                <div>
                  <FaHome size={20} className="icon" />
                </div>
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className={`text-center animate-button mx-2 mx-lg-1 ${linksAnimation ? "link-fade-in" : ""}`}>
              <Nav.Link
                as={Link}
                to="/doctors"
                className={`nav-link ${activeLink === "/doctors" ? "active-link" : ""}`}
                onClick={() => setActiveLink("/doctors")}
              >
                <div>
                  <FaUserMd size={20} className="icon" />
                </div>
                Our Doctors
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className={`text-center animate-button mx-2 mx-lg-1 ${linksAnimation ? "link-fade-in" : ""}`}>
              <Nav.Link
                as={Link}
                to="/patients"
                className={`nav-link ${activeLink === "/patients" ? "active-link" : ""}`}
                onClick={() => setActiveLink("/patients")}
              >
                <div>
                  <FaUser size={20} className="icon" />
                </div>
                Our Patients
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className={`text-center animate-button mx-2 mx-lg-1 ${linksAnimation ? "link-fade-in" : ""}`}>
              <Nav.Link
                as={Link}
                to="/appointments"
                className={`nav-link ${activeLink === "/appointments" ? "active-link" : ""}`}
                onClick={() => setActiveLink("/appointments")}
              >
                <div>
                  <FaCalendarAlt size={20} className="icon" />
                </div>
                Appointments
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Right Links */}
          <Nav className="ms-auto slide-in-right d-flex flex-row mt-3 mt-lg-0">
            {/* Search Form */}
            <Nav.Item>
              <Form className="d-flex px-5 input-group w-auto ms-lg-3 my-3 my-lg-0" onSubmit={handleSearch}>
                <Form.Control
                  type="search"
                  placeholder="Search by name, specialization, etc."
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-box" // Add class for custom styling
                />
                <Button variant="outline-white" type="submit" className="search-button">
                  <FaSearch size={18} />
                </Button>
              </Form>
            </Nav.Item>

            {/* Logout or Login/Register Links */}
            {token ? (
              <Nav.Item className="text-center mx-2 mx-lg-1">
                <Button
                  variant="outline-danger"
                  className="fs-6"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Logout
                </Button>
              </Nav.Item>
            ) : (
              <>
                <Nav.Item className="text-center mx-2 mx-lg-1">
                  <Nav.Link as={Link} to="/login" className="fs-6">
                    Login
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="text-center mx-2 mx-lg-1">
                  <Nav.Link as={Link} to="/register" className="fs-6">
                    Register
                  </Nav.Link>
                </Nav.Item>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default CustomNavbar;