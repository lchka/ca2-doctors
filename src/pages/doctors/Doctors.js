import { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col, Alert, Form, Pagination } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';
import doctorOne from '../../images/1.png';
import doctorTwo from '../../images/2.png';
import doctorThree from '../../images/3.png';
import doctorFour from '../../images/4.png';
import doctorFive from '../../images/5.png';
import '../../styles/Doctors.scss';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [specialisationSuggestions, setSpecialisationSuggestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [doctorsPerPage] = useState(8); // Number of doctors per page
    const { token } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const msg = location.state?.success || null;

    const specialisations = [
        "Podiatrist", "Dermatologist", "Pediatrician", 
        "Psychiatrist", "General Practitioner"
    ];

    const images = [doctorOne, doctorTwo, doctorThree, doctorFour, doctorFive];

    useEffect(() => {
        getDoctors();
    }, []);

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

        const suggestions = specialisations.filter(specialisation =>
            specialisation.toLowerCase().includes(query)
        );
        setSpecialisationSuggestions(suggestions);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        const filtered = doctors.filter(doctor => 
            doctor.specialisation.toLowerCase().includes(suggestion.toLowerCase())
        );
        setFilteredDoctors(filtered);
        setSpecialisationSuggestions([]);
    };

    // Get current doctors
    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container className="mt-4">
            {msg && <Alert variant="info" className="text-center">{msg}</Alert>}
            <h1 className="text-center mb-4">Doctors</h1>
            <Button variant="primary" className="btn-view-details rounded-3 text-uppercase fw-semibold my-3" onClick={() => navigate('/doctor/create')}>
                Create Doctor
            </Button>
            <Form.Group controlId="search" className="mb-4">
                <Form.Control
                    type="text"
                    placeholder="Search by name or specialisation"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="rounded-3"
                />
                {specialisationSuggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {specialisationSuggestions.map((suggestion, index) => (
                            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </Form.Group>
            <Row>
                {currentDoctors.map((doctor, index) => (
                    <Col key={doctor.id} sm={12} md={6} lg={3}>
                        <Card className={`mb-3 doctor-card rounded-5 ${index % 4 < 2 ? 'animate-left' : 'animate-right'}`}>
                            <Card.Img variant="top" src={images[index % images.length]} alt="Doctor" className="rounded-top my-2" />
                            <Card.Body>
                                <Card.Title>{doctor.first_name} {doctor.last_name}</Card.Title>
                                <Card.Text>Specialisation: {doctor.specialisation}</Card.Text>
                                <Button variant="primary" className="btn-view-details rounded-3 text-uppercase fw-semibold" onClick={() => navigate(`/doctor/${doctor.id}`)}>View Details</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Pagination className="justify-content-center mt-4">
                {Array.from({ length: Math.ceil(filteredDoctors.length / doctorsPerPage) }, (_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </Container>
    );
};

export default Doctors;