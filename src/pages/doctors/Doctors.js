import { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col, Alert, Form } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';
import doctorImage from '../../images/doctor.jpg'; // Importing the image

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [specialisationQuery, setSpecialisationQuery] = useState('');
    const [specialisationSuggestions, setSpecialisationSuggestions] = useState([]);
    const { token } = useAuth();
    const navigate = useNavigate();

    const msg = useLocation()?.state?.msg || null;

    const specialisations = [
        "Podiatrist", "Dermatologist", "Pediatrician", 
        "Psychiatrist", "General Practitioner"
    ];

    const getDoctors = async () => {
        try {
            const response = await axios.get('https://fed-medical-clinic-api.vercel.app/doctors');
            setDoctors(response.data);
            setFilteredDoctors(response.data); // Set both full and filtered list initially
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = doctors.filter(doctor => 
            `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(query) || 
            doctor.specialisation.toLowerCase().includes(query)
        );

        setFilteredDoctors(filtered);
    };

    const handleSpecialisationChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSpecialisationQuery(query);

        // Filter suggestions based on user input
        const filteredSuggestions = specialisations.filter(spec =>
            spec.toLowerCase().includes(query)
        );

        setSpecialisationSuggestions(filteredSuggestions);
    };

    const handleSelectSpecialisation = (specialisation) => {
        setSpecialisationQuery(specialisation);
        setSpecialisationSuggestions([]); // Clear suggestions when a specialisation is selected
    };

    useEffect(() => {
        getDoctors();
    }, []);

    return (
        <Container className="mt-4">
            {msg && <Alert variant="info">{msg}</Alert>}
            <Row className="mb-3">
                <Col className="text-end">
                    <Button variant="success" onClick={() => navigate('/doctor/create')}>Add Doctor</Button>
                </Col>
            </Row>

            {/* Search Filter */}
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Control 
                        type="text" 
                        placeholder="Search by Name or Specialisation" 
                        value={searchQuery} 
                        onChange={handleSearchChange}
                    />
                </Col>
            </Row>

            {/* Specialisation Auto-Suggest */}
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Control 
                        type="text" 
                        placeholder="Search by Specialisation" 
                        value={specialisationQuery} 
                        onChange={handleSpecialisationChange}
                    />
                    {specialisationSuggestions.length > 0 && (
                        <ul className="list-group mt-2" style={{ position: "absolute", zIndex: 1000 }}>
                            {specialisationSuggestions.map((suggestion, index) => (
                                <li 
                                    key={index} 
                                    className="list-group-item" 
                                    onClick={() => handleSelectSpecialisation(suggestion)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </Col>
            </Row>

            {/* Doctor List */}
            <Row>
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                        <Col key={doctor.id} sm={12} md={6} lg={3}>
                            <Card className="mb-3 rounded">
                                <Card.Img variant="top" src={doctorImage} alt="Doctor" />
                                <Card.Body>
                                    <Card.Title className="fs-4 fw-bold">{doctor.first_name} {doctor.last_name}</Card.Title>
                                    <Card.Text className="fs-5">{doctor.specialisation}</Card.Text>
                                    <Button variant="primary" onClick={() => navigate(`/doctor/${doctor.id}`)}>View Details</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col className="text-center">
                        <p>No doctors found matching your search.</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default Doctors;
