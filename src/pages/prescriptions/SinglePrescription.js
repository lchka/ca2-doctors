import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Alert, Button, Spinner } from 'react-bootstrap';
import { useAuth } from "../../utils/useAuth";

const SinglePrescription = () => {
    const { token } = useAuth();
    const [prescription, setPrescription] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Add a loading state
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPrescription = async () => {
            try {
                const response = await axios.get(`https://fed-medical-clinic-api.vercel.app/prescriptions/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPrescription(response.data);
            } catch (error) {
                console.error('Error fetching prescription:', error);
                setError('Error fetching prescription');
            } finally {
                setLoading(false); // Stop loading after data is fetched
            }
        };

        fetchPrescription();
    }, [id, token]);

    // Show loading spinner while waiting for response
    if (loading) {
        return (
            <Container className="mt-4">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    // Handle error state
    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>Prescription Details</Card.Title>
                    <Card.Text>Patient ID: {prescription?.patient_id}</Card.Text>
                    <Card.Text>Doctor ID: {prescription?.doctor_id}</Card.Text>
                    <Card.Text>Diagnosis ID: {prescription?.diagnosis_id}</Card.Text>
                    <Card.Text>Medication: {prescription?.medication}</Card.Text>
                    <Card.Text>Dosage: {prescription?.dosage}</Card.Text>
                    <Card.Text>Start Date: {prescription?.start_date}</Card.Text>
                    <Card.Text>End Date: {prescription?.end_date}</Card.Text>
                    <Button variant="primary" onClick={() => navigate(`/prescriptions/${id}/edit`)}>Edit Prescription</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SinglePrescription;
