import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';

const Create = () => {
    const { token } = useAuth();
    const [form, setForm] = useState({
        patient_id: '',
        condition: '',
        diagnosis_date: '',
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    
    // Extract patient_id from the query string
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const patientId = queryParams.get('patient_id');

    useEffect(() => {
        if (patientId) {
            setForm((prevForm) => ({
                ...prevForm,
                patient_id: patientId,
            }));
        }
    }, [patientId]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        // Validate Patient ID (Ensure it's an integer)
        if (!form.patient_id || isNaN(form.patient_id)) {
            return "Patient ID must be a valid number.";
        }

        // Validate Condition
        if (!form.condition) {
            return "Condition is required.";
        }

        // Validate Diagnosis Date
        if (!form.diagnosis_date) {
            return "Diagnosis Date is required.";
        }
        
        // Check if the diagnosis date is in the correct format (DDMMYY)
        const datePattern = /^(\d{2})(\d{2})(\d{2})$/;
        const match = form.diagnosis_date.match(datePattern);
        
        if (!match) {
            return "Diagnosis Date must be in the format DDMMYY.";
        }

        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // JS months are 0-11
        const year = parseInt('20' + match[3], 10); // Convert to full year (20YY)

        // Check if it's a valid date
        const validDate = new Date(year, month, day);
        if (validDate.getDate() !== day || validDate.getMonth() !== month || validDate.getFullYear() !== year) {
            return "Please enter a valid date.";
        }

        return null; // All validations passed
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form data
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        // Convert patient_id to integer before submitting
        const updatedForm = {
            ...form,
            patient_id: parseInt(form.patient_id, 10),  // Convert patient_id to integer
        };

        // Format the diagnosis date as YYYY-MM-DD (ISO format)
        const [day, month, year] = form.diagnosis_date.split(/(?<=\d{2})/);
        const formattedDate = new Date(`20${year}-${month}-${day}`).toISOString().split('T')[0];
        
        updatedForm.diagnosis_date = formattedDate;

        try {
            const response = await axios.post('https://fed-medical-clinic-api.vercel.app/diagnoses', updatedForm, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            // Handle successful response
            setSuccessMessage("Diagnosis added successfully!");
            navigate(`/patient/${updatedForm.patient_id}`);
        } catch (err) {
            // Handle error response and display detailed errora message
            console.error("Error Response:", err.response);
            if (err.response?.data?.error) {
                setError(err.response.data.error.message || "Error adding diagnosis");
            } else {
                setError("An unknown error occurred.");
            }
        }
    };

    return (
        <Container className="mt-4">
            <h1>Add Diagnosis</h1>
            
            {/* Success Message */}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            {/* Error Message */}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formPatientId">
                    <Form.Label>Patient ID</Form.Label>
                    <Form.Control
                        type="text"
                        name="patient_id"
                        value={form.patient_id}
                        readOnly
                        style={{ filter: 'blur(0.5px)' }} // Slight blur effect
                    />
                </Form.Group>

                <Form.Group controlId="formCondition">
                    <Form.Label>Condition</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter condition"
                        name="condition"
                        value={form.condition}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formDiagnosisDate">
                    <Form.Label>Diagnosis Date (DDMMYY)</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter diagnosis date (DDMMYY)"
                        name="diagnosis_date"
                        value={form.diagnosis_date}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Add Diagnosis
                </Button>
            </Form>
        </Container>
    );
};

export default Create;
