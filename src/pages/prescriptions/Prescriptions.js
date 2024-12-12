import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';

const Prescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get('https://fed-medical-clinic-api.vercel.app/prescriptions', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPrescriptions(response.data);
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
                setError('Error fetching prescriptions');
            }
        };

        fetchPrescriptions();
    }, [token]);

    if (!prescriptions.length) {
        return 'Loading...';
    }

    return (
        <Container className="mt-4">
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" className="mb-3" onClick={() => navigate('/prescriptions/create')}>
                Create Prescription
            </Button>
            <Row>
                {prescriptions.map((prescription) => (
                    <Col key={prescription.id} sm={12} md={6} lg={4}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Prescription</Card.Title>
                                <Card.Text>Medication: {prescription.medication}</Card.Text>
                                <Card.Text>Dosage: {prescription.dosage}</Card.Text>
                                <Button variant="primary" onClick={() => navigate(`/prescriptions/${prescription.id}`)}>View Details</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Prescriptions;