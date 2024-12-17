import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Alert, Button } from 'react-bootstrap';
import { useAuth } from "../../utils/useAuth";
import '../../styles/Appointments.scss';

const SingleAppointment = () => {
    const { token } = useAuth();
    const [appointment, setAppointment] = useState(null);
    const [patient, setPatient] = useState(null);
    const [doctor, setDoctor] = useState(null);
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
                fetchPatient(response.data.patient_id);
                fetchDoctor(response.data.doctor_id);
            } catch (error) {
                console.error('Error fetching appointment:', error);
                setError('Error fetching appointment');
            }
        };

        const fetchPatient = async (patientId) => {
            try {
                const response = await axios.get(`https://fed-medical-clinic-api.vercel.app/patients/${patientId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPatient(response.data);
            } catch (error) {
                console.error('Error fetching patient:', error);
                setError('Error fetching patient');
            }
        };

        const fetchDoctor = async (doctorId) => {
            try {
                const response = await axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/${doctorId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDoctor(response.data);
            } catch (error) {
                console.error('Error fetching doctor:', error);
                setError('Error fetching doctor');
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
                    <Card.Text>Appointment Date: {appointment.appointment_date}</Card.Text>
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