import { useEffect, useState } from "react"; // Import React hooks
import axios from 'axios'; // Import axios for HTTP requests
import { useLocation, useNavigate } from "react-router-dom"; // Import navigation hooks
import { Card, Button, Container, Row, Col, Alert, Form, Pagination } from 'react-bootstrap'; // Import Bootstrap components
import { useAuth } from '../../utils/useAuth'; // Import custom authentication hook
import doctorOne from '../../images/1.png'; // Doctor image imports
import doctorTwo from '../../images/2.png';
import doctorThree from '../../images/3.png';
import doctorFour from '../../images/4.png';
import doctorFive from '../../images/5.png';
import '../../styles/Doctors.scss'; // Import SCSS file for consistent styling

const Doctors = () => {
    const [doctors, setDoctors] = useState([]); // State for all doctors
    const [filteredDoctors, setFilteredDoctors] = useState([]); // State for filtered doctors based on search query
    const [searchQuery, setSearchQuery] = useState(''); // State for the search query
    const [specialisationSuggestions, setSpecialisationSuggestions] = useState([]); // State for specialisation suggestions
    const [currentPage, setCurrentPage] = useState(1); // State for current page in pagination
    const [doctorsPerPage] = useState(8); // Number of doctors to display per page
    const { token } = useAuth(); // Get authentication token
    const navigate = useNavigate(); // Navigate hook
    const location = useLocation(); // Location hook to get navigation state

    const msg = location.state?.success || null; // Display success message from location state

    // Define available specialisations
    const specialisations = [
        "Podiatrist", "Dermatologist", "Pediatrician", 
        "Psychiatrist", "General Practitioner"
    ];

    // Array of doctor images
    const images = [doctorOne, doctorTwo, doctorThree, doctorFour, doctorFive];

    // Fetch doctors on initial load
    useEffect(() => {
        getDoctors();
    }, []);

    // Function to get all doctors from API
    const getDoctors = async () => {
        try {
            const response = await axios.get('https://fed-medical-clinic-api.vercel.app/doctors');
            setDoctors(response.data);
            setFilteredDoctors(response.data); // Set both full and filtered list initially
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    // Handle change in search query
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter doctors based on search query (name or specialisation)
        const filtered = doctors.filter(doctor => 
            `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(query) ||
            doctor.specialisation.toLowerCase().includes(query)
        );
        setFilteredDoctors(filtered);

        // Filter specialisation suggestions based on query
        const suggestions = specialisations.filter(specialisation =>
            specialisation.toLowerCase().includes(query)
        );
        setSpecialisationSuggestions(suggestions);
    };

    // Handle click on specialisation suggestion
    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        const filtered = doctors.filter(doctor => 
            doctor.specialisation.toLowerCase().includes(suggestion.toLowerCase())
        );
        setFilteredDoctors(filtered);
        setSpecialisationSuggestions([]); // Clear suggestions after selection
    };

    // Get current doctors to display based on pagination
    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

    // Change page in pagination
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container className="mt-4">
            {/* Display success message if available */}
            {msg && <Alert variant="info" className="text-center">{msg}</Alert>}
            <h1 className="text-center mb-4">Doctors</h1>
            
            {/* Button to navigate to create doctor page */}
            <Button variant="primary" className="btn-view-details rounded-3 text-uppercase fw-semibold my-3" onClick={() => navigate('/doctor/create')}>
                Create Doctor
            </Button>
            
            {/* Search form */}
            <Form.Group controlId="search" className="mb-4">
                <Form.Control
                    type="text"
                    placeholder="Search by name or specialisation"
                    value={searchQuery}
                    onChange={handleSearchChange} // Call function on input change
                    className="rounded-3"
                />
                
                {/* Show specialisation suggestions if there are any */}
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
                {/* Display current doctors in grid layout */}
                {currentDoctors.map((doctor, index) => (
                    <Col key={doctor.id} sm={12} md={6} lg={3}>
                        <Card className={`mb-3 doctor-card rounded-5 ${index % 4 < 2 ? 'animate-left' : 'animate-right'}`}>
                            <Card.Img variant="top" src={images[index % images.length]} alt="Doctor" className="rounded-top my-2" />
                            <Card.Body>
                                <Card.Title>{doctor.first_name} {doctor.last_name}</Card.Title>
                                <Card.Text>Specialisation: {doctor.specialisation}</Card.Text>
                                {/* Button to navigate to doctor details page */}
                                <Button variant="primary" className="btn-view-details rounded-3 text-uppercase fw-semibold" onClick={() => navigate(`/doctor/${doctor.id}`)}>View Details</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            
            {/* Pagination controls */}
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

export default Doctors; // Export component for use in other parts of the app
