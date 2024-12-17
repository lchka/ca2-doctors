import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, Container, Alert, Button } from 'react-bootstrap';
import { useAuth } from "../../utils/useAuth";
import '../../styles/Doctors.scss';

const SingleDoctor = () => {
    const { token } = useAuth();
    const [doctor, setDoctor] = useState(null);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const successMessage = location.state?.success || null;

    useEffect(() => {
        axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                setDoctor(res.data);
            })
            .catch((err) => {
                console.error('Error fetching doctor:', err);
                setError('Error fetching doctor');
            });
    }, [id, token]);

    const handleDelete = async () => {
        try {
            await axios.delete(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/doctors', { state: { success: 'Doctor successfully deleted!' } });
        } catch (error) {
            console.error('Error deleting doctor:', error);
            setError('Error deleting doctor');
        }
    };

    if (!doctor) {
        return 'Loading...';
    }

    return (
        <Container className="my-5">
            <h2 className="my-3">Doctor Details</h2>
            {successMessage && <Alert variant="info">{successMessage}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Card className="mb-3 single-doctor-card">
                <Card.Body>
                    <Card.Title className="fw-bold">Doctor Details</Card.Title>
                    <Card.Text>First Name: {doctor.first_name}</Card.Text>
                    <Card.Text>Last Name: {doctor.last_name}</Card.Text>
                    <Card.Text>Specialisation: {doctor.specialisation}</Card.Text>
                    <Button variant="primary" className="btn-view-details text-uppercase fw-semibold rounded-3 me-2" onClick={() => navigate(`/doctors/${id}/edit`)}>Edit Doctor</Button>
                    <Button className="btn-delete text-uppercase fw-semibold rounded-3" onClick={handleDelete}>Delete Doctor</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SingleDoctor;