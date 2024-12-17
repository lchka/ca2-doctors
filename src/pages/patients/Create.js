import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';
import '../../styles/CreateForm.scss'; // Import the SCSS file for consistent form styling

const Create = () => {
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        address: ''
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { token } = useAuth();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

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
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted");
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            console.error("Validation errors:", errors);
            return;
        }
        try {
            await axios.post('https://fed-medical-clinic-api.vercel.app/patients', form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/patients', { state: { success: 'Patient successfully created!' } }); // Navigate to "Our Patients" page after successful creation
        } catch (err) {
            console.error("Error creating patient:", err);
            if (err.response && err.response.data && err.response.data.message) {
                if (err.response.data.message.includes("email already exists")) {
                    setValidationErrors({ email: "Email already exists" });
                } else {
                    setError(err.response.data.message);
                }
            } else {
                setError('Error creating patient');
            }
        }
    };

    return (
        <Container className="create-form-container my-5">
            <h1>Create Patient</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="create-form p-4 rounded shadow">
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
                        {validationErrors.email}
                    </Form.Control.Feedback>
                </Form.Group>

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
                        {validationErrors.phone}
                    </Form.Control.Feedback>
                </Form.Group>

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
                        {validationErrors.date_of_birth}
                    </Form.Control.Feedback>
                </Form.Group>

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

                <Button variant="primary" type="submit" className="w-100">
                    Create
                </Button>
            </Form>
        </Container>
    );
};

export default Create;