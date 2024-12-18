import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';
import SpecialisationDropDown from '../../components/SpecialisationDropDown';
import '../../styles/CreateForm.scss'; // Import SCSS file for consistent form styling

const Edit = () => {
    // Initialize state for the form and error message
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        specialisation: ''
    });
    const [error, setError] = useState(null); // State for any error message
    const navigate = useNavigate(); // For navigation after successful submission
    const { id } = useParams(); // Get the doctor ID from URL parameters
    const { token } = useAuth(); // Access the authentication token

    useEffect(() => {
        // Fetch doctor details to populate the form on initial load
        const fetchDoctor = async () => {
            try {
                const response = await axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in request headers
                    }
                });
                setForm(response.data); // Set fetched data to the form state
            } catch (error) {
                console.error('Error fetching doctor:', error); // Log error in case of failure
                setError('Error fetching doctor'); // Display error message
            }
        };

        fetchDoctor(); // Call function to fetch doctor data
    }, [id, token]); // Run effect when `id` or `token` changes

    const handleChange = (e) => {
        // Update form state when any input field is changed
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSpecialisationChange = (specialisation) => {
        // Update specialisation when the dropdown value changes
        setForm({
            ...form,
            specialisation
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            // Send a PATCH request to update the doctor details
            await axios.patch(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, form, {
                headers: {
                    Authorization: `Bearer ${token}` // Include token in request headers
                }
            });
            // Navigate to the doctor's profile page with a success message
            navigate(`/doctor/${id}`, { state: { success: 'Doctor successfully updated!' } });
        } catch (err) {
            console.error('Error updating doctor:', err); // Log error in case of failure
            if (err.response && err.response.data && err.response.data.error) {
                // Handle validation errors if available
                setError(err.response.data.error.issues.map(issue => issue.message).join(', '));
            } else if (err.response && err.response.data && err.response.data.message) {
                // Show specific error message if available
                setError(err.response.data.message);
            } else {
                setError('Error updating doctor'); // Generic error message
            }
        }
    };

    return (
        <Container className="my-5">
            <h1>Edit Doctor</h1>
            {error && <Alert variant="danger">{error}</Alert>} {/* Display error message if any */}
            <Form onSubmit={handleSubmit} className="create-form p-4 rounded shadow">
                {/* First Name Field */}
                <Form.Group controlId="formFirstName" className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange} // Update form state on change
                    />
                </Form.Group>

                {/* Last Name Field */}
                <Form.Group controlId="formLastName" className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange} // Update form state on change
                    />
                </Form.Group>

                {/* Email Field */}
                <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={form.email}
                        onChange={handleChange} // Update form state on change
                    />
                </Form.Group>

                {/* Phone Field */}
                <Form.Group controlId="formPhone" className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter phone number"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange} // Update form state on change
                    />
                </Form.Group>

                {/* Specialisation Dropdown */}
                <Form.Group controlId="formSpecialisation" className="mb-3">
                    <Form.Label>Specialisation</Form.Label>
                    <SpecialisationDropDown
                        selectedSpecialisation={form.specialisation}
                        onSpecialisationChange={handleSpecialisationChange} // Handle specialisation change
                    />
                </Form.Group>

                {/* Submit Button */}
                <Button variant="primary" type="submit" className="w-100">
                    Update
                </Button>
            </Form>
        </Container>
    );
};

export default Edit; // Export the Edit component for use elsewhere in the app
