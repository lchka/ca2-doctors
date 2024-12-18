import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Alert, Button, Card, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import '../../styles/Appointments.scss';

const Appointments = () => {
    const { token, user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState({});
    const [patients, setPatients] = useState({});
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
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

        const fetchDoctors = async () => {
            try {
                const response = await axios.get('https://fed-medical-clinic-api.vercel.app/doctors', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const doctorsData = response.data.reduce((acc, doctor) => {
                    acc[doctor.id] = `${doctor.first_name} ${doctor.last_name}`;
                    return acc;
                }, {});
                setDoctors(doctorsData);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setError('Error fetching doctors');
            }
        };

        const fetchPatients = async () => {
            try {
                const response = await axios.get('https://fed-medical-clinic-api.vercel.app/patients', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const patientsData = response.data.reduce((acc, patient) => {
                    acc[patient.id] = `${patient.first_name} ${patient.last_name}`;
                    return acc;
                }, {});
                setPatients(patientsData);
            } catch (error) {
                console.error('Error fetching patients:', error);
                setError('Error fetching patients');
            }
        };

        fetchAppointments();
        fetchDoctors();
        fetchPatients();
    }, [token]);

    const getDoctorName = (doctorId) => doctors[doctorId] || 'Unknown';
    const getPatientName = (patientId) => patients[patientId] || 'Unknown';

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const formatDate = (dateString) => {
        if (typeof dateString !== 'string') {
            dateString = dateString.toString();
        }
        const day = dateString.slice(0, 2);
        const month = dateString.slice(2, 4) - 1; // Months are zero-indexed in JavaScript
        const year = '20' + dateString.slice(4, 6); // Assuming the year is in the 2000s
        const date = new Date(year, month, day);
        return date.toLocaleDateString();
    };

    const filterAppointments = () => {
        return appointments.filter((appointment) => {
            const doctorName = getDoctorName(appointment.doctor_id).toLowerCase();
            const patientName = getPatientName(appointment.patient_id).toLowerCase();
            const appointmentDate = String(appointment.appointment_date).replace(/-/g, '').slice(0, 6); // Convert to ddmmyy format
    
            return (
                doctorName.includes(searchQuery.toLowerCase()) ||
                patientName.includes(searchQuery.toLowerCase()) ||
                appointmentDate.includes(searchQuery.replace(/\D/g, ''))
            );
        });
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
            <Form.Control
                type="text"
                placeholder="Search by doctor name, patient name, or date (ddmmyy)"
                value={searchQuery}
                onChange={handleSearch}
                className="mb-4"
            />
            <Row>
                {filterAppointments().map((appointment) => (
                    <Col key={appointment.id} sm={12} md={6} lg={4}>
                        <Card className="mb-3 appointment-card rounded-5">
                            <Card.Body>
                                <Card.Title>Appointment</Card.Title>
                                <Card.Text>Appointment Date: {formatDate(appointment.appointment_date)}</Card.Text>
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