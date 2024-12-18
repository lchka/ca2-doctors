import { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col, Alert, Form, Pagination } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';
import patientImage from '../../images/patient.png'; // Importing the image
import '../../styles/Patients.scss';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const patientsPerPage = 8; // Maximum number of patients per page

    const { state } = useLocation();
    const successMessage = state?.success || null;

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
    }, [token]);

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
        <Container className="my-4">
            {successMessage && <Alert variant="info">{successMessage}</Alert>}
            <h1 className="text-center mb-4">Patients</h1>
            <Row className="mb-3">
                <Col className="text-end">
                    <Button className="btn-view-details rounded-3 text-uppercase fw-semibold" onClick={() => navigate('/patients/create')}>Create Patient</Button>
                </Col>
            </Row>

            {/* Search Filter */}
            <Form.Group controlId="search" className="my-4">
                <Form.Control
                    type="text"
                    placeholder="Search by Name or Phone"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="rounded-3 "
                />
            </Form.Group>

            {/* Patient List */}
            <Row>
                {currentPatients.length > 0 ? (
                    currentPatients.map((patient, index) => (
                        <Col key={patient.id} sm={12} md={6} lg={3}>
                            <Card className={`mb-3 patient-card rounded-5 ${index % 4 < 2 ? 'animate-left' : 'animate-right'}`}>
                                <Card.Img variant="top" src={patientImage} alt="Patient" className="rounded-top my-2" />
                                <Card.Body>
                                    <Card.Title className="fs-4 fw-bold">{patient.first_name} {patient.last_name}</Card.Title>
                                    <Card.Text className="fs-5">Phone: {patient.phone}</Card.Text>
                                    <Button variant="primary" className="btn-view-details rounded-3 text-uppercase fw-semibold" onClick={() => navigate(`/patient/${patient.id}`)}>View Details</Button>
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
            <Row className="my-5">
                <Col className="d-flex justify-content-center">
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

export default Patients;