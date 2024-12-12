import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';

const Diagnoses = () => {
    const [diagnoses, setDiagnoses] = useState([]);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDiagnoses = async () => {
            try {
                const response = await axios.get('https://fed-medical-clinic-api.vercel.app/diagnoses', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDiagnoses(response.data);
            } catch (error) {
                console.error('Error fetching diagnoses:', error);
                setError('Error fetching diagnoses');
            }
        };

        fetchDiagnoses();
    }, [token]);

    if (!diagnoses.length) {
        return 'Loading...';
    }

    return (
        <Container className="mt-4">
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" className="mb-3" onClick={() => navigate('/diagnoses/create')}>
                Create Diagnosis
            </Button>
            <Row>
                {diagnoses.map((diagnosis) => (
                    <Col key={diagnosis.id} sm={12} md={6} lg={4}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Diagnosis</Card.Title>
                                <Card.Text>Patient ID: {diagnosis.patient_id}</Card.Text>
                                <Card.Text>Condition: {diagnosis.condition}</Card.Text>
                                <Card.Text>Diagnosis Date: {diagnosis.diagnosis_date}</Card.Text>
                                <Button variant="primary" onClick={() => navigate(`/diagnoses/${diagnosis.id}`)}>View Details</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Diagnoses;