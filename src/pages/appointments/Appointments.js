import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';
import '../../styles/Appointments.scss';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState(null);
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

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

        const fetchPatients = async () => {
            try {
                const response = await axios.get('https://fed-medical-clinic-api.vercel.app/patients', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPatients(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
                setError('Error fetching patients');
            }
        };

        const fetchDoctors = async () => {
            try {
                const response = await axios.get('https://fed-medical-clinic-api.vercel.app/doctors', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setError('Error fetching doctors');
            }
        };

        fetchAppointments();
        fetchPatients();
        fetchDoctors();
    }, [token]);

    const getPatientName = (id) => {
        const patient = patients.find(patient => patient.id === id);
        return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';
    };

    const getDoctorName = (id) => {
        const doctor = doctors.find(doctor => doctor.id === id);
        return doctor ? `${doctor.first_name} ${doctor.last_name}` : 'Unknown Doctor';
    };

    if (!appointments.length) {
        return 'Loading...';
    }

    return (
        <Container className="my-4">
            {error && <Alert variant="danger">{error}</Alert>}
            {location.state && location.state.success && (
                <Alert variant="info" className="text-center">{location.state.success}</Alert>
            )}
            <h1>Hey {user?.first_name ? user.first_name : ''}! These are all appointments</h1>
            <Button variant="primary" className="btn-view-details text-uppercase fw-semibold rounded-3 mb-4" onClick={() => navigate('/appointments/create')}>
                Create Appointment
            </Button>
            <Row>
                {appointments.map((appointment) => (
                    <Col key={appointment.id} sm={12} md={6} lg={4}>
                        <Card className="mb-3 appointment-card rounded-5">
                            <Card.Body>
                                <Card.Title>Appointment</Card.Title>
                                <Card.Text>Appointment Date: {appointment.appointment_date}</Card.Text>
                                <Card.Text>Doctor: {getDoctorName(appointment.doctor_id)}</Card.Text>
                                <Card.Text>Patient: {getPatientName(appointment.patient_id)}</Card.Text>
                                <Button variant="primary" className="btn-view-details text-uppercase fw-semibold rounded-3" onClick={() => navigate(`/appointments/${appointment.id}`)}>View Details</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Appointments;