import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';

const Create = () => {
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        specialisation: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { token } = useAuth();

    const specialisations = [
        "Podiatrist",
        "Dermatologist",
        "Pediatrician",
        "Psychiatrist",
        "General Practitioner"
    ];

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://fed-medical-clinic-api.vercel.app/doctors', form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/');
        } catch (err) {
            setError('Error creating doctor');
        }
    };

    return (
        <Container className="mt-4">
            <h1>Create Doctor</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter phone number"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formSpecialisation">
                    <Form.Label>Specialisation</Form.Label>
                    <Form.Control
                        as="select"
                        name="specialisation"
                        value={form.specialisation}
                        onChange={handleChange}
                    >
                        <option value="">Select specialisation</option>
                        {specialisations.map((specialisation) => (
                            <option key={specialisation} value={specialisation}>
                                {specialisation}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Create
                </Button>
            </Form>
        </Container>
    );
};

export default Create;