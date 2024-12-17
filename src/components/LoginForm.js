import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import '../styles/LoginForm.scss';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

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
          
          {error && <Alert variant="danger" className="text-center">{error}</Alert>}
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
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;