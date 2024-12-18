import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/useAuth'; // Custom hook for authentication
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import '../styles/RegisterForm.scss';

// Registration form component
const RegisterForm = () => {
  const navigate = useNavigate(); // React Router hook for navigation
  const { login } = useAuth(); // Destructure the login method from useAuth

  // State to manage form inputs
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });

  // State to handle error messages
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Send registration data to the backend API
      const res = await axios.post(`https://fed-medical-clinic-api.vercel.app/register`, form);
      
      // Save user data to local storage
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Log in the user after successful registration
      await login(form.email, form.password);
      
      // Redirect to the home page
      navigate('/');
    } catch (err) {
      // Handle registration errors
      setError('Registration failed. Please try again.');
    }
  };

  // Handle input changes and update the form state
  const handleChange = (e) => {
    setForm({
      ...form, // Spread the existing form state
      [e.target.name]: e.target.value // Update the field that triggered the change
    });
  };

  return (
    <Container className="register-form-container my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          {/* Informational alert for users */}
          <Alert variant="warning" className="text-center">
            Oops! If you're brought here, you must log/register in to view this info!
          </Alert>

          {/* Display error alert if registration fails */}
          {error && <Alert variant="danger" className="text-center">{error}</Alert>}

          {/* Registration form */}
          <Form onSubmit={handleSubmit} className="register-form p-4 rounded shadow">
            <h2 className="text-center mb-4">Register</h2>

            {/* First Name input */}
            <Form.Group controlId="formFirstName" className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                placeholder="Enter first name"
                value={form.first_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Last Name input */}
            <Form.Group controlId="formLastName" className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                placeholder="Enter last name"
                value={form.last_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Email input */}
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

            {/* Password input */}
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Submit button */}
            <Button variant="primary" type="submit" className="w-100">
              Register
            </Button>
          </Form>

          {/* Link to login page */}
          <div className="text-center mt-3">
            <p>
              Already have an account? <Link to="/login">Log in here</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;
