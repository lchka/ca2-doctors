import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Alert, Button, Card, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import '../../styles/Appointments.scss';

const Appointments = () => {
    const { token, user } = useAuth(); // Access token and user data from the custom authentication hook
    const [appointments, setAppointments] = useState([]); // State for storing appointments
    const [doctors, setDoctors] = useState({}); // State for mapping doctor IDs to names
    const [patients, setPatients] = useState({}); // State for mapping patient IDs to names
    const [error, setError] = useState(null); // State for error messages
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    const navigate = useNavigate(); // Hook for programmatic navigation
    const location = useLocation(); // Hook for accessing current route location

    useEffect(() => {
        // Fetch all appointments
        const fetchAppointments = async () => {
            try {
                const response = await axios.get('https://fed-medical-clinic-api.vercel.app/appointments', {
                    headers: {
                        Authorization: `Bearer ${token}` // Attach the token in the request header
                    }
                });
                setAppointments(response.data); // Set appointments data
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setError('Error fetching appointments');
            }
        };

        // Fetch all doctors and map their IDs to names
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('https://fed-medical-clinic-api.vercel.app/doctors', {
                    headers: {
                        Authorization: `Bearer ${token}` // Attach the token in the request header
                    }
                });
                const doctorsData = response.data.reduce((acc, doctor) => {
                    acc[doctor.id] = `${doctor.first_name} ${doctor.last_name}`; // Map doctor ID to full name
                    return acc;
                }, {});
                setDoctors(doctorsData); // Set doctors data
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setError('Error fetching doctors');
            }
        };

        // Fetch all patients and map their IDs to names
        const fetchPatients = async () => {
            try {
                const response = await axios.get('https://fed-medical-clinic-api.vercel.app/patients', {
                    headers: {
                        Authorization: `Bearer ${token}` // Attach the token in the request header
                    }
                });
                const patientsData = response.data.reduce((acc, patient) => {
                    acc[patient.id] = `${patient.first_name} ${patient.last_name}`; // Map patient ID to full name
                    return acc;
                }, {});
                setPatients(patientsData); // Set patients data
            } catch (error) {
                console.error('Error fetching patients:', error);
                setError('Error fetching patients');
            }
        };

        // Call the fetch functions on component mount
        fetchAppointments();
        fetchDoctors();
        fetchPatients();
    }, [token]); // Run effect whenever the token changes

    // Helper function to get doctor name by ID
    const getDoctorName = (doctorId) => doctors[doctorId] || 'Unknown';

    // Helper function to get patient name by ID
    const getPatientName = (patientId) => patients[patientId] || 'Unknown';

    // Handle search input change
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Format the date string to a readable format
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

    // Filter appointments based on the search query
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
        return 'Loading...'; // Show loading message while data is being fetched
    }

    return (
        <Container className="my-4">
            {/* Display error messages if any */}
            {error && <Alert variant="danger">{error}</Alert>}
            {/* Display success message passed via location state */}
            {location.state && location.state.success && (
                <Alert variant="info" className="text-center">{location.state.success}</Alert>
            )}
            <h1>Hey {user?.first_name ? user.first_name : ''}! These are all appointments</h1>
            {/* Button to navigate to the appointment creation page */}
            <Button variant="primary" className="btn-view-details text-uppercase fw-semibold rounded-3 mb-4" onClick={() => navigate('/appointments/create')}>
                Create Appointment
            </Button>
            {/* Search input field */}
            <Form.Control
                type="text"
                placeholder="Search by doctor name, patient name, or date (ddmmyy)"
                value={searchQuery}
                onChange={handleSearch}
                className="mb-4"
            />
            {/* Render appointment cards */}
            <Row>
                {filterAppointments().map((appointment) => (
                    <Col key={appointment.id} sm={12} md={6} lg={4}>
                        <Card className="mb-3 appointment-card rounded-5">
                            <Card.Body>
                                <Card.Title>Appointment</Card.Title>
                                <Card.Text>Appointment Date: {formatDate(appointment.appointment_date)}</Card.Text>
                                <Card.Text>Doctor: {getDoctorName(appointment.doctor_id)}</Card.Text>
                                <Card.Text>Patient: {getPatientName(appointment.patient_id)}</Card.Text>
                                {/* Button to view appointment details */}
                                <Button variant="primary" className="btn-view-details text-uppercase fw-semibold rounded-3" onClick={() => navigate(`/appointments/${appointment.id}`)}>View Details</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Appointments; // Export the Appointments component
