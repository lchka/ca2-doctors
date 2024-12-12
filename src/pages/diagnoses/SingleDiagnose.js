import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Alert, Button } from 'react-bootstrap';
import { useAuth } from "../../utils/useAuth";

const SingleDiagnose = () => {
    const { token } = useAuth();
    const [diagnosis, setDiagnosis] = useState(null);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDiagnosis = async () => {
            try {
                const response = await axios.get(`https://fed-medical-clinic-api.vercel.app/diagnoses/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDiagnosis(response.data);
            } catch (error) {
                console.error('Error fetching diagnosis:', error);
                setError('Error fetching diagnosis');
            }
        };

        fetchDiagnosis();
    }, [id, token]);

    if (!diagnosis) {
        return 'Loading...';
    }

    return (
        <Container className="mt-4">
            {error && <Alert variant="danger">{error}</Alert>}
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>Diagnosis Details</Card.Title>
                    <Card.Text>Patient ID: {diagnosis.patient_id}</Card.Text>
                    <Card.Text>Condition: {diagnosis.condition}</Card.Text>
                    <Card.Text>Diagnosis Date: {diagnosis.diagnosis_date}</Card.Text>
                    <Button variant="primary" onClick={() => navigate(`/diagnoses/${id}/edit`)}>Edit Diagnosis</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SingleDiagnose;