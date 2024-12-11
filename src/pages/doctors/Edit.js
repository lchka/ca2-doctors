import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';

const Edit = () => {
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        specialisation: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();

    const specialisations = [
        "Podiatrist",
        "Dermatologist",
        "Pediatrician",
        "Psychiatrist",
        "General Practitioner"
    ];

    useEffect(() => {
        // Fetch the doctor's details to populate the form
        const fetchDoctor = async () => {
            try {
                const response = await axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setForm(response.data);
            } catch (error) {
                console.error('Error fetching doctor:', error);
            }
        };

        fetchDoctor();
    }, [id, token]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate(`/doctor/${id}`, { replace: true });
        } catch (err) {
            setError('Error updating doctor');
        }
    };

    return (
        <Container className="mt-4">
            <h1>Edit Doctor</h1>
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
                    Update
                </Button>
            </Form>
        </Container>
    );
};

export default Edit;