import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../utils/useAuth';
import '../styles/LoginForm.scss';

// Define a functional component named LoginForm
const LoginForm = () => {
  // State to manage form data
  const [form, setForm] = useState({ email: '', password: '' });
  // State to manage error messages
  const [error, setError] = useState(null);
  // Get the login function from the useAuth hook
  const { login } = useAuth();
  // Get the navigate function from the useNavigate hook
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Attempt to log in with the provided email and password
      await login(form.email, form.password);
      // Navigate to the home page on successful login
      navigate('/');
    } catch (err) {
      // Set an error message if login fails
      setError('Invalid credentials. Please try again.');
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container className="login-form-container my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          {/* Display error message if there is an error */}
          {error && <Alert variant="danger" className="text-center">{error}</Alert>}
          {/* Render the login form */}
          <Form onSubmit={handleSubmit} className="login-form p-4 rounded shadow">
            <h2 className="text-center mb-4">Login</h2>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

// Export the LoginForm component as the default export
export default LoginForm;