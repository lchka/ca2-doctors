import { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col, Alert } from 'react-bootstrap';

const Home = () => {
    const [doctors, setDoctors] = useState([]);

    const navigate = useNavigate();

    // We saw in a previous class how our ProtectedRoute checks for authorisation
    // if no token is found, it redirects to the '/' route, passing a 'msg' via the route state
    // if there is a message, we retrieve it here and display it
    const msg = useLocation()?.state?.msg || null;

    const getDoctors = async () => {
        try {
            const response = await axios.get('https://fed-medical-clinic-api.vercel.app/doctors');
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    useEffect(() => {
        getDoctors();
    }, []);

    return (
        <Container>
            {msg && <Alert variant="info">{msg}</Alert>}
            <Row>
                {doctors.map((doctor) => (
                    <Col key={doctor.id} sm={12} md={6} lg={4}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>{doctor.first_name} {doctor.last_name}</Card.Title>
                                <Card.Text>{doctor.specialisation}</Card.Text>
                                <Button variant="primary" onClick={() => navigate(`/doctor/${doctor.id}`)}>View Details</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Home;