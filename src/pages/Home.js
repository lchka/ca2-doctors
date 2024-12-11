import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useLocation } from "react-router-dom";

const Home = () => {
    const msg = useLocation()?.state?.msg || null;

    return (
        <Container className="mt-4">
            {msg && <Alert variant="info">{msg}</Alert>}
            <Row className="justify-content-center">
                <Col md={8} className="text-center">
                    <h1 className="display-4">Welcome to Dun Laoghaire Medical Center</h1>
                    <p className="lead">Providing quality healthcare services to the community.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;