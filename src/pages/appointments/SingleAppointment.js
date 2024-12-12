import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Alert, Button } from 'react-bootstrap';
import { useAuth } from "../../utils/useAuth";

const SingleAppointment = () => {
    const { token } = useAuth();
    const [appointment, setAppointment] = useState(null);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await axios.get(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAppointment(response.data);
            } catch (error) {
                console.error('Error fetching appointment:', error);
                setError('Error fetching appointment');
            }
        };

        fetchAppointment();
    }, [id, token]);

    if (!appointment) {
        return 'Loading...';
    }

    return (
        <Container className="mt-4">
            {error && <Alert variant="danger">{error}</Alert>}
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>Appointment Details</Card.Title>
                    <Card.Text>Appointment Date: {appointment.appointment_date}</Card.Text>
                    <Card.Text>Doctor ID: {appointment.doctor_id}</Card.Text>
                    <Card.Text>Patient ID: {appointment.patient_id}</Card.Text>
                    <Button variant="primary" onClick={() => navigate(`/appointments/${id}/edit`)}>Edit Appointment</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SingleAppointment;