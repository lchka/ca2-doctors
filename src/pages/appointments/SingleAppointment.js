import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';
import '../../styles/Appointments.scss';

const SingleAppointment = () => {
    const { token } = useAuth(); // Access token from the authentication hook
    const { id } = useParams(); // Extract the appointment ID from the URL
    const navigate = useNavigate(); // Hook for navigation
    const [appointment, setAppointment] = useState(null); // State for appointment details
    const [patient, setPatient] = useState(null); // State for patient details
    const [doctor, setDoctor] = useState(null); // State for doctor details
    const [error, setError] = useState(null); // State for error messages

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                // Fetch appointment details
                const response = await axios.get(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Attach token in the request header
                    }
                });
                setAppointment(response.data);

                // Fetch patient details based on appointment's patient ID
                const patientResponse = await axios.get(`https://fed-medical-clinic-api.vercel.app/patients/${response.data.patient_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPatient(patientResponse.data);

                // Fetch doctor details based on appointment's doctor ID
                const doctorResponse = await axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/${response.data.doctor_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDoctor(doctorResponse.data);
            } catch (error) {
                console.error('Error fetching appointment data:', error); // Log error
                setError('Error fetching appointment data'); // Set error message
            }
        };

        fetchAppointment(); // Fetch appointment, doctor, and patient data on component mount
    }, [id, token]); // Dependency array ensures this runs when `id` or `token` changes

    const handleDelete = async () => {
        try {
            // Send a delete request to remove the appointment
            await axios.delete(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Attach token in the request header
                }
            });
            // Redirect to the appointments list with a success message
            navigate('/appointments', { state: { success: 'Appointment successfully deleted!' } });
        } catch (error) {
            console.error('Error deleting appointment:', error); // Log error
            setError('Error deleting appointment'); // Set error message
        }
    };

    const formatDate = (dateString) => {
        if (typeof dateString !== 'string') {
            dateString = dateString.toString();
        }
        const day = dateString.slice(0, 2);
        const month = dateString.slice(2, 4) - 1; // Months are zero-indexed in JavaScript
        const year = '20' + dateString.slice(4, 6); // Assuming the year is in the 2000s
        const date = new Date(year, month, day);
        return date.toLocaleDateString(); // Return formatted date string
    };

    // Show a loading message until all data is fetched
    if (!appointment || !patient || !doctor) {
        return 'Loading...';
    }

    return (
        <Container className="my-5">
            <h2 className="my-4 pb-5">Remember to double check your Appointments!</h2>
            {error && <Alert variant="danger">{error}</Alert>} {/* Display error message if any */}
            <Card className="mb-3 single-appointment-card">
                <Card.Body>
                    <Card.Title className="fw-bold">Appointment Details</Card.Title>
                    <Card.Text>Appointment Date: {formatDate(appointment.appointment_date)}</Card.Text>
                    <Card.Text>Doctor: {doctor.first_name} {doctor.last_name}</Card.Text>
                    <Card.Text>Patient: {patient.first_name} {patient.last_name}</Card.Text>
                    {/* Button to navigate to the edit appointment page */}
                    <Button
                        variant="primary"
                        className="btn-view-details text-uppercase fw-semibold rounded-3 me-2"
                        onClick={() => navigate(`/appointments/${id}/edit`)}
                    >
                        Edit Appointment
                    </Button>
                    {/* Button to delete the appointment */}
                    <Button
                        className="btn-delete text-uppercase fw-semibold rounded-3"
                        onClick={handleDelete}
                    >
                        Delete Appointment
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SingleAppointment; // Export the SingleAppointment component
