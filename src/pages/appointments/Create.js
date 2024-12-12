import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';

const Create = () => {
    const [form, setForm] = useState({
        appointment_date: '',
        doctor_id: '',
        patient_id: ''
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://fed-medical-clinic-api.vercel.app/appointments', form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/appointments'); // Navigate to the appointments list page after successful creation
        } catch (error) {
            console.error('Error creating appointment:', error);
            setError('Error creating appointment');
        }
    };

    return (
        <Container className="mt-4">
            <h1>Create Appointment</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formAppointmentDate">
                    <Form.Label>Appointment Date</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter appointment date"
                        name="appointment_date"
                        value={form.appointment_date}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formDoctorId">
                    <Form.Label>Doctor ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter doctor ID"
                        name="doctor_id"
                        value={form.doctor_id}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formPatientId">
                    <Form.Label>Patient ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter patient ID"
                        name="patient_id"
                        value={form.patient_id}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Create
                </Button>
            </Form>
        </Container>
    );
};

export default Create;