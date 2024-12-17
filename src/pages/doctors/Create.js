import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';
import SpecialisationDropDown from '../../components/SpecialisationDropDown';
import '../../styles/CreateForm.scss';

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

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSpecialisationChange = (specialisation) => {
        setForm({
            ...form,
            specialisation
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (form.phone.length > 10) {
            setError('Phone number cannot be longer than 10 characters.');
            return;
        }

        try {
            console.log('Sending doctor data:', form);
            await axios.post('https://fed-medical-clinic-api.vercel.app/doctors', form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/doctors', { state: { success: 'Doctor successfully created!' } });
        } catch (err) {
            console.error('Error creating doctor:', err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error.issues.map(issue => issue.message).join(', '));
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Error creating doctor');
            }
        }
    };

    return (
        <Container className="my-5">
            <h1>Create Doctor</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="create-form p-4 rounded shadow">
                <Form.Group controlId="formFirstName" className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formLastName" className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPhone" className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter phone number"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        maxLength={10}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formSpecialisation" className="mb-3">
                    <Form.Label>Specialisation</Form.Label>
                    <SpecialisationDropDown
                        selectedSpecialisation={form.specialisation}
                        onSpecialisationChange={handleSpecialisationChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Create
                </Button>
            </Form>
        </Container>
    );
};

export default Create;