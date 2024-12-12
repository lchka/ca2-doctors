import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get('https://fed-medical-clinic-api.vercel.app/appointments', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setError('Error fetching appointments');
            }
        };

        fetchAppointments();
    }, [token]);

    if (!appointments.length) {
        return 'Loading...';
    }

    return (
        <Container className="mt-4">
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" className="mb-3" onClick={() => navigate('/appointments/create')}>
                Create Appointment
            </Button>
            <Row>
                {appointments.map((appointment) => (
                    <Col key={appointment.id} sm={12} md={6} lg={4}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Appointment</Card.Title>
                                <Card.Text>Appointment Date: {appointment.appointment_date}</Card.Text>
                                <Card.Text>Doctor ID: {appointment.doctor_id}</Card.Text>
                                <Card.Text>Patient ID: {appointment.patient_id}</Card.Text>
                                <Button variant="primary" onClick={() => navigate(`/appointments/${appointment.id}`)}>View Details</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Appointments;