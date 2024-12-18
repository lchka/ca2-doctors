import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';
import '../../styles/Appointments.scss';

const SingleAppointment = () => {
    const { token } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [patient, setPatient] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await axios.get(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAppointment(response.data);

                const patientResponse = await axios.get(`https://fed-medical-clinic-api.vercel.app/patients/${response.data.patient_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPatient(patientResponse.data);

                const doctorResponse = await axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/${response.data.doctor_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDoctor(doctorResponse.data);
            } catch (error) {
                console.error('Error fetching appointment data:', error);
                setError('Error fetching appointment data');
            }
        };

        fetchAppointment();
    }, [id, token]);

    const handleDelete = async () => {
        try {
            await axios.delete(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/appointments', { state: { success: 'Appointment successfully deleted!' } });
        } catch (error) {
            console.error('Error deleting appointment:', error);
            setError('Error deleting appointment');
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
        return date.toLocaleDateString();
    };

    if (!appointment || !patient || !doctor) {
        return 'Loading...';
    }

    return (
        <Container className="my-5">
            <h2 className="my-3">Remember to double check your Appointments!</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Card className="mb-3 single-appointment-card">
                <Card.Body>
                    <Card.Title className="fw-bold">Appointment Details</Card.Title>
                    <Card.Text>Appointment Date: {formatDate(appointment.appointment_date)}</Card.Text>
                    <Card.Text>Doctor: {doctor.first_name} {doctor.last_name}</Card.Text>
                    <Card.Text>Patient: {patient.first_name} {patient.last_name}</Card.Text>
                    <Button variant="primary" className="btn-view-details text-uppercase fw-semibold rounded-3 me-2" onClick={() => navigate(`/appointments/${id}/edit`)}>Edit Appointment</Button>
                    <Button className="btn-delete text-uppercase fw-semibold rounded-3" onClick={handleDelete}>Delete Appointment</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SingleAppointment;