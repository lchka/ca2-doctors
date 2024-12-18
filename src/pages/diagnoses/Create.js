import { useState, useEffect } from "react"; // Import React hooks
import axios from 'axios'; // Import axios for HTTP requests
import { useNavigate, useLocation } from "react-router-dom"; // Import hooks for navigation and location
import { Form, Button, Container, Alert } from 'react-bootstrap'; // Import Bootstrap components
import { useAuth } from '../../utils/useAuth'; // Import custom authentication hook
import "../../styles/CreateForm.scss"; // Import the SCSS file for consistent form styling

// Component: CreateDiagnosis
// Purpose: Allows creation of a new diagnosis for a patient
const CreateDiagnosis = () => {
    const { token } = useAuth(); // Get authentication token
    const [form, setForm] = useState({
        patient_id: '', // Store patient ID
        condition: '', // Store the condition for diagnosis
        diagnosis_date: '', // Store the diagnosis date
    });
    const [error, setError] = useState(null); // State for error messages
    const navigate = useNavigate(); // Navigation hook
    
    // Extract patient_id from the query string in the URL
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const patientId = queryParams.get('patient_id'); // Get patient_id from query params

    // If patient_id exists in query params, set it in the form
    useEffect(() => {
        if (patientId) {
            setForm((prevForm) => ({
                ...prevForm,
                patient_id: patientId, // Set patient ID from query string
            }));
        }
    }, [patientId]);

    // Handle form field changes
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value, // Update the specific form field
        });
    };

    // Validate form input data
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Validate the form data
        const validationError = validateForm();
        if (validationError) {
            setError(validationError); // Show validation error if any
            return;
        }

        // Convert patient_id to integer before submitting
        const updatedForm = {
            ...form,
            patient_id: parseInt(form.patient_id, 10), // Ensure patient_id is an integer
        };

        // Format the diagnosis date as YYYY-MM-DD (ISO format)
        const [day, month, year] = form.diagnosis_date.split(/(?<=\d{2})/);
        const formattedDate = new Date(`20${year}-${month}-${day}`).toISOString().split('T')[0];
        
        updatedForm.diagnosis_date = formattedDate;

        try {
            // Send a POST request to add the diagnosis
            await axios.post('https://fed-medical-clinic-api.vercel.app/diagnoses', updatedForm, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the auth token
                    'Content-Type': 'application/json', // Set content type to JSON
                }
            });

            // Navigate to the patient's page on success with a success message
            navigate(`/patient/${updatedForm.patient_id}`, { state: { success: 'Diagnosis added successfully.' } });
        } catch (err) {
            // Handle error response and display detailed error message
            console.error("Error Response:", err.response);
            if (err.response?.data?.error) {
                setError(err.response.data.error.message || "Error adding diagnosis");
            } else {
                setError("An unknown error occurred.");
            }
        }
    };

    return (
        <Container className="create-form-container my-5">
            <h1>Add Diagnosis</h1>

            {/* Display error message if any */}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit} className="create-form p-4 rounded shadow">
                <Form.Group controlId="formPatientId" className="mb-3">
                    <Form.Label>Patient ID</Form.Label>
                    <Form.Control
                        type="text"
                        name="patient_id"
                        value={form.patient_id}
                        readOnly // Patient ID is read-only as it's pre-populated
                    />
                </Form.Group>

                <Form.Group controlId="formCondition" className="mb-3">
                    <Form.Label>Condition</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter condition"
                        name="condition"
                        value={form.condition}
                        onChange={handleChange} // Update condition on change
                        required // Make condition a required field
                    />
                </Form.Group>

                <Form.Group controlId="formDiagnosisDate" className="mb-3">
                    <Form.Label>Diagnosis Date (DDMMYY)</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter diagnosis date (DDMMYY)"
                        name="diagnosis_date"
                        value={form.diagnosis_date}
                        onChange={handleChange} // Update diagnosis date on change
                        required // Make diagnosis date a required field
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                    Add Diagnosis
                </Button>
            </Form>
        </Container>
    );
};

export default CreateDiagnosis; // Export the component
