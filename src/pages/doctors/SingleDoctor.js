import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, Container, Alert, Button } from 'react-bootstrap';
import { useAuth } from "../../utils/useAuth";
import '../../styles/Doctors.scss';

const SingleDoctor = () => {
    const { token } = useAuth(); // Get token for authentication
    const [doctor, setDoctor] = useState(null); // State to store doctor data
    const [error, setError] = useState(null); // State to store error messages
    const { id } = useParams(); // Get doctor ID from URL parameters
    const navigate = useNavigate(); // Hook for navigation
    const location = useLocation(); // Hook to access location state for success messages

    const successMessage = location.state?.success || null; // Get success message from location state

    // Fetch doctor details on component mount
    useEffect(() => {
        axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // Pass token for authentication
            }
        })
            .then((res) => {
                setDoctor(res.data); // Set doctor data on successful fetch
            })
            .catch((err) => {
                console.error('Error fetching doctor:', err);
                setError('Error fetching doctor'); // Set error state if fetching fails
            });
    }, [id, token]); // Re-fetch doctor details if ID or token changes

   // Handle delete action for doctor and associated data
   const handleDelete = async () => {
    try {
        // Fetch and delete associated appointments
        const appointmentsResponse = await axios.get(
            `https://fed-medical-clinic-api.vercel.app/appointments?doctor_id=${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}` // Authorization header for appointments
                }
            }
        );
        const appointments = appointmentsResponse.data.filter(appointment => appointment.doctor_id === parseInt(id));
        for (const appointment of appointments) {
            await axios.delete(
                `https://fed-medical-clinic-api.vercel.app/appointments/${appointment.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Authorization header for deleting appointments
                    }
                }
            );
        }

        // Fetch and delete associated prescriptions
        const prescriptionsResponse = await axios.get(
            `https://fed-medical-clinic-api.vercel.app/prescriptions?doctor_id=${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}` // Authorization header for prescriptions
                }
            }
        );
        const prescriptions = prescriptionsResponse.data.filter(prescription => prescription.doctor_id === parseInt(id));
        for (const prescription of prescriptions) {
            await axios.delete(
                `https://fed-medical-clinic-api.vercel.app/prescriptions/${prescription.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Authorization header for deleting prescriptions
                    }
                }
            );
        }

        // Fetch and delete associated diagnoses
        const diagnosesResponse = await axios.get(
            `https://fed-medical-clinic-api.vercel.app/diagnoses?doctor_id=${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}` // Authorization header for diagnoses
                }
            }
        );
        const diagnoses = diagnosesResponse.data.filter(diagnosis => diagnosis.doctor_id === parseInt(id));
        for (const diagnosis of diagnoses) {
            await axios.delete(
                `https://fed-medical-clinic-api.vercel.app/diagnoses/${diagnosis.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Authorization header for deleting diagnoses
                    }
                }
            );
        }

        // Finally, delete the doctor
        await axios.delete(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // Authorization header for deleting doctor
            }
        });
        navigate('/doctors', { state: { success: 'Doctor and all associated data successfully deleted!' } }); // Redirect to doctors list with success message
    } catch (error) {
        console.error('Error deleting doctor or associated data:', error);
        setError(error.response?.data?.message || 'Error deleting doctor or associated data'); // Display error if deletion fails
    }
};

    // If doctor data is not yet loaded, show a loading message
    if (!doctor) {
        return 'Loading...';
    }

    return (
        <Container className="my-5">
            <h2 className="my-3">Doctor Details</h2>
            {successMessage && <Alert variant="info">{successMessage}</Alert>} {/* Display success message if exists */}
            {error && <Alert variant="danger">{error}</Alert>} {/* Display error message if exists */}
            <Card className="mb-3 single-doctor-card">
                <Card.Body>
                    <Card.Title className="fw-bold">Doctor Details</Card.Title>
                    <Card.Text>First Name: {doctor.first_name}</Card.Text>
                    <Card.Text>Last Name: {doctor.last_name}</Card.Text>
                    <Card.Text>Email: {doctor.email}</Card.Text>
                    <Card.Text>Phone: {doctor.phone}</Card.Text>
                    <Card.Text>Specialisation: {doctor.specialisation}</Card.Text>
                    {/* Buttons to edit or delete the doctor */}
                    <Button variant="primary" className="btn-view-details text-uppercase fw-semibold rounded-3 me-2" onClick={() => navigate(`/doctors/${id}/edit`)}>Edit Doctor</Button>
                    <Button className="btn-delete text-uppercase fw-semibold rounded-3" onClick={handleDelete}>Delete Doctor</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SingleDoctor;
