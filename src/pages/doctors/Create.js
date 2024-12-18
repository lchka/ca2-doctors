import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';
import SpecialisationDropDown from '../../components/SpecialisationDropDown';
import '../../styles/CreateForm.scss';

const Create = () => {
    // State to hold form data and error messages
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        specialisation: ''
    });
    const [error, setError] = useState(null); // Error state for validation messages
    const navigate = useNavigate(); // Hook for navigation
    const { token } = useAuth(); // Fetch the token for authorization

    // Handle form input change
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value // Update form state based on input name
        });
    };

    // Handle specialisation change from dropdown
    const handleSpecialisationChange = (specialisation) => {
        setForm({
            ...form,
            specialisation // Update specialisation in the form state
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation for phone number length
        if (form.phone.length > 10) {
            setError('Phone number cannot be longer than 10 characters.');
            return;
        }

        try {
            console.log('Sending doctor data:', form);
            // Send POST request to create a new doctor
            await axios.post('https://fed-medical-clinic-api.vercel.app/doctors', form, {
                headers: {
                    Authorization: `Bearer ${token}` // Attach token for authentication
                }
            });
            navigate('/doctors', { state: { success: 'Doctor successfully created!' } }); // Redirect to doctor list page
        } catch (err) {
            console.error('Error creating doctor:', err);
            // Handle error response from server and display error message
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error.issues.map(issue => issue.message).join(', '));
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Error creating doctor');
            }
        }
    };

    return (
        <Container className="my-5">
            <h1>Create Doctor</h1>
            {error && <Alert variant="danger">{error}</Alert>} {/* Display error if exists */}
            <Form onSubmit={handleSubmit} className="create-form p-4 rounded shadow">
                {/* First Name Input */}
                <Form.Group controlId="formFirstName" className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {/* Last Name Input */}
                <Form.Group controlId="formLastName" className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {/* Email Input */}
                <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {/* Phone Input */}
                <Form.Group controlId="formPhone" className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter phone number"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        maxLength={10} // Limiting to 10 characters
                        required
                    />
                </Form.Group>

                {/* Specialisation Dropdown */}
                <Form.Group controlId="formSpecialisation" className="mb-3">
                    <Form.Label>Specialisation</Form.Label>
                    <SpecialisationDropDown
                        selectedSpecialisation={form.specialisation}
                        onSpecialisationChange={handleSpecialisationChange}
                        required
                    />
                </Form.Group>

                {/* Submit Button */}
                <Button variant="primary" type="submit" className="w-100">
                    Create
                </Button>
            </Form>
        </Container>
    );
};

export default Create;
