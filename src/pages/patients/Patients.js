import { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';
import patientImage from '../../images/patient.png'; // Importing the image

const Patient = () => {
    const [patients, setPatients] = useState([]);
    const { token } = useAuth();
    const navigate = useNavigate();

    // We saw in a previous class how our ProtectedRoute checks for authorisation
    // if no token is found, it redirects to the '/' route, passing a 'msg' via the route state
    // if there is a message, we retrieve it here and display it
    const msg = useLocation()?.state?.msg || null;

    const getPatients = async () => {
        try {
            const response = await axios.get('https://fed-medical-clinic-api.vercel.app/patients', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    useEffect(() => {
        getPatients();
    }, []);

    return (
        <Container className="mt-4">
            {msg && <Alert variant="info">{msg}</Alert>}
            <Row className="mb-3">
                <Col className="text-end">
                    <Button variant="success" onClick={() => navigate('/patients/create')}>Add Patient</Button>
                </Col>
            </Row>
            <Row>
                {patients.map((patient) => (
                    <Col key={patient.id} sm={12} md={6} lg={3}>
                        <Card className="mb-3 rounded">
                            <Card.Img variant="top" src={patientImage} alt="Patient" />
                            <Card.Body>
                                <Card.Title className="fs-4 fw-bold">{patient.first_name} {patient.last_name}</Card.Title>
                                <Card.Text className="fs-5">Phone: {patient.phone}</Card.Text>
                                <Button variant="primary" onClick={() => navigate(`/patient/${patient.id}`)}>View Details</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Patient;