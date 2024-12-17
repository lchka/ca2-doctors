import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';
import SpecialisationDropDown from '../../components/SpecialisationDropDown';
import '../../styles/CreateForm.scss';

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
                setError('Error fetching doctor');
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

    const handleSpecialisationChange = (specialisation) => {
        setForm({
            ...form,
            specialisation
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
            navigate(`/doctor/${id}`, { state: { success: 'Doctor successfully updated!' } });
        } catch (err) {
            console.error('Error updating doctor:', err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error.issues.map(issue => issue.message).join(', '));
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Error updating doctor');
            }
        }
    };

    return (
        <Container className="my-5">
            <h1>Edit Doctor</h1>
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
                    />
                </Form.Group>

                <Form.Group controlId="formSpecialisation" className="mb-3">
                    <Form.Label>Specialisation</Form.Label>
                    <SpecialisationDropDown
                        selectedSpecialisation={form.specialisation}
                        onSpecialisationChange={handleSpecialisationChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Update
                </Button>
            </Form>
        </Container>
    );
};

export default Edit;