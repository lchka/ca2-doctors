import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#f0f8ff", padding: "30px 0", color: "#333" }}>
      <Container>
        <Row className="text-center">
          {/* Quick Links Section */}
          <Col md={4} className="mb-4">
            <h5 className="fw-semibold">Quick Links</h5>
            <Nav className="flex-column align-items-center">
              <Nav.Link href="#services" style={{ color: "#333" }}>
                Our Services
              </Nav.Link>
              <Nav.Link href="#appointment" style={{ color: "#333" }}>
                Book an Appointment
              </Nav.Link>
              <Nav.Link href="#contact" style={{ color: "#333" }}>
                Contact Us
              </Nav.Link>
              <Nav.Link href="#testimonials" style={{ color: "#333" }}>
                Testimonials
              </Nav.Link>
            </Nav>
          </Col>

          {/* Contact Section */}
          <Col md={4} className="mb-4">
            <h5 className="fw-semibold">Contact</h5>
            <p>
              <strong>Phone:</strong> (123) 456-7890
            </p>
            <p>
              <strong>Email:</strong> info@medicalplace.com
            </p>
            <p>
              <strong>Address:</strong> 123 Health St., Medical City, Country
            </p>
          </Col>

          {/* Follow Us Section */}
          <Col md={4} className="mb-4">
            <h5 className="fw-semibold" >Follow Us</h5>
            <Nav className="flex-column align-items-center">
              <Nav.Link href="https://facebook.com" style={{ color: "#333" }}>
                Facebook
              </Nav.Link>
              <Nav.Link href="https://twitter.com" style={{ color: "#333" }}>
                Twitter
              </Nav.Link>
              <Nav.Link href="https://instagram.com" style={{ color: "#333" }}>
                Instagram
              </Nav.Link>
              <Nav.Link href="https://linkedin.com" style={{ color: "#333" }}>
                LinkedIn
              </Nav.Link>
            </Nav>
          </Col>
        </Row>

        {/* Footer Bottom */}
        <Row className="mt-5">
          <Col className="text-center">
            <p style={{ color: "#888", fontSize: "14px" }}>
              &copy; {new Date().getFullYear()} DL Medical Place. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
