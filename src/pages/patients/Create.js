import { useState } from "react"; // Import React hooks for state management
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for routing
import { Form, Button, Container, Alert } from 'react-bootstrap'; // Import Bootstrap components for form elements and alerts
import { useAuth } from '../../utils/useAuth'; // Import custom authentication hook
import '../../styles/CreateForm.scss'; // Import SCSS file for styling

const Create = () => {
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        address: ''
    }); // State to store form data
    const [validationErrors, setValidationErrors] = useState({}); // State to store form validation errors
    const [error, setError] = useState(null); // State to store API error messages
    const navigate = useNavigate(); // Hook to navigate between pages
    const { token } = useAuth(); // Get authentication token

    // Handle form input change
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Validate form inputs before submitting
    const validateForm = () => {
        const errors = {};
        if (!form.email.includes('@')) {
            errors.email = "Email must contain an '@' sign";
        }
        if (!/^\d{10}$/.test(form.phone)) {
            errors.phone = "Phone number must be 10 digits";
        }
        if (!/^\d{6}$/.test(form.date_of_birth)) {
            errors.date_of_birth = "Date of birth must be in ddmmyy format";
        }
        return errors; // Return errors object if there are any validation issues
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const errors = validateForm(); // Validate form inputs
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors); // Set validation errors
            return; // Stop submission if there are errors
        }
        try {
            // Make API request to create new patient
            await axios.post('https://fed-medical-clinic-api.vercel.app/patients', form, {
                headers: {
                    Authorization: `Bearer ${token}` // Send authentication token with request
                }
            });
            // Redirect to the patients page with a success message
            navigate('/patients', { state: { success: 'Patient successfully created!' } });
        } catch (err) {
            // Handle errors from the API
            if (err.response && err.response.data && err.response.data.message) {
                if (err.response.data.message.includes("email already exists")) {
                    setValidationErrors({ email: "Email already exists" }); // Handle email duplication error
                } else {
                    setError(err.response.data.message); // Display generic error message
                }
            } else {
                setError('Error creating patient'); // Display default error message
            }
        }
    };

    return (
        <Container className="create-form-container my-5">
            <h1>Create Patient</h1>
            {/* Show error alert if any error occurs */}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="create-form p-4 rounded shadow">
                {/* First Name Field */}
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

                {/* Last Name Field */}
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

                {/* Email Field with Validation */}
                <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.email}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {validationErrors.email} {/* Display email validation error */}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Phone Number Field with Validation */}
                <Form.Group controlId="formPhone" className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter phone number"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.phone}
                        maxLength={10}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {validationErrors.phone} {/* Display phone validation error */}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Date of Birth Field with Validation */}
                <Form.Group controlId="formDateOfBirth" className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter date of birth (ddmmyy)"
                        name="date_of_birth"
                        value={form.date_of_birth}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.date_of_birth}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {validationErrors.date_of_birth} {/* Display date of birth validation error */}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Address Field */}
                <Form.Group controlId="formAddress" className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
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

export default Create; // Export the Create component
