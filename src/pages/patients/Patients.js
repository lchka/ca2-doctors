import { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col, Alert, Form, Pagination } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';
import patientImage from '../../images/patient.png'; // Importing the image

const Patient = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const patientsPerPage = 10; // Maximum number of patients per page

    const msg = useLocation()?.state?.msg || null;

    const getPatients = async () => {
        try {
            const response = await axios.get('https://fed-medical-clinic-api.vercel.app/patients', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPatients(response.data);
            setFilteredPatients(response.data); // Set both full and filtered list initially
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter patients by first name, last name, or phone number
        const filtered = patients.filter(patient => 
            patient.first_name.toLowerCase().includes(query) ||
            patient.last_name.toLowerCase().includes(query) ||
            patient.phone.includes(query)
        );

        // Set the filtered patients to the state
        setFilteredPatients(filtered);

        // Reset to first page whenever the search query changes
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        getPatients();
    }, []);

    // Paginate the filteredPatients
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

    // Pagination logic
    const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <Container className="mt-4">
            {msg && <Alert variant="info">{msg}</Alert>}
            <Row className="mb-3">
                <Col className="text-end">
                    <Button variant="success" onClick={() => navigate('/patients/create')}>Add Patient</Button>
                </Col>
            </Row>

            {/* Search Filter */}
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Control 
                        type="text" 
                        placeholder="Search by Name or Phone" 
                        value={searchQuery} 
                        onChange={handleSearchChange}
                    />
                </Col>
            </Row>

            {/* Patient List */}
            <Row>
                {currentPatients.length > 0 ? (
                    currentPatients.map((patient) => (
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
                    ))
                ) : (
                    <Col className="text-center">
                        <p>No patients found matching your search.</p>
                    </Col>
                )}
            </Row>

            {/* Pagination */}
            <Row className="mt-4">
                <Col className="text-center">
                    <Pagination>
                        <Pagination.Prev 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                        />
                        {pageNumbers.map(number => (
                            <Pagination.Item 
                                key={number} 
                                active={number === currentPage} 
                                onClick={() => handlePageChange(number)}
                            >
                                {number}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </Col>
            </Row>
        </Container>
    );
};

export default Patient;
