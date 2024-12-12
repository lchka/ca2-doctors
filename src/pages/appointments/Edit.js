import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';

const Edit = () => {
    const [form, setForm] = useState({
        appointment_date: '',
        doctor_id: '',
        patient_id: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await axios.get(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setForm(response.data);
            } catch (error) {
                console.error('Error fetching appointment:', error);
                setError('Error fetching appointment');
            }
        };

        fetchAppointment();
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
            await axios.put(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate(`/appointments/${id}`); // Navigate to the appointment details page after successful update
        } catch (error) {
            console.error('Error updating appointment:', error);
            setError('Error updating appointment');
        }
    };

    return (
        <Container className="mt-4">
            <h1>Edit Appointment</h1>
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
                    Update
                </Button>
            </Form>
        </Container>
    );
};

export default Edit;