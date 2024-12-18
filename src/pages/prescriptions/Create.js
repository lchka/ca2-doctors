import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useAuth } from "../../utils/useAuth";
import DoctorDropDown from "../../components/DoctorDropDown";
import "../../styles/CreateForm.scss"; // Import the SCSS file for consistent form styling

const Create = () => {
    const { token } = useAuth(); // Get the authentication token
    const navigate = useNavigate(); // Navigation after form submission
    const location = useLocation(); // Access the current URL location

    // Get the diagnosis_id and patient_id from the URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const diagnosis_id = queryParams.get("diagnosis_id");
    const patient_id = queryParams.get("patient_id");

    const [form, setForm] = useState({
        medication: "",
        dosage: "",
        start_date: "", // Expecting 6 digits: ddmmyy
        end_date: "",   // Expecting 6 digits: ddmmyy
        diagnosis_id: diagnosis_id || "", // Pre-fill diagnosis_id if available
        patient_id: patient_id || "",     // Pre-fill patient_id if available
        doctor_id: "", // Initially no doctor selected
    });

    const [error, setError] = useState(null); // To store API error messages

    // Utility to validate dates (6 digits only)
    const isValidDate = (date) => /^\d{6}$/.test(date);

    // Handle input field changes, especially for date fields (sanitize input)
    const handleChange = (e) => {
        let { name, value } = e.target;

        // Sanitize date input fields to allow only 6 digits
        if (name === "start_date" || name === "end_date") {
            value = value.replace(/\D/g, "").slice(0, 6); // Only digits, max 6 characters
        }

        setForm({
            ...form,
            [name]: value,
        });
    };

    // Handle doctor selection from the dropdown
    const handleDoctorChange = (doctor_id) => {
        setForm({
            ...form,
            doctor_id, // Set selected doctor ID
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
    
        // Ensure ID fields are numbers (necessary for backend)
        const payload = {
            ...form,
            patient_id: Number(form.patient_id),
            doctor_id: Number(form.doctor_id),
            diagnosis_id: Number(form.diagnosis_id),
        };
    
        console.log("Form data after conversion:", payload); // Debugging
    
        // Validate dates
        if (!isValidDate(payload.start_date) || !isValidDate(payload.end_date)) {
            setError("Start Date and End Date must be exactly 6 digits (ddmmyy).");
            return;
        }
    
        try {
            const response = await axios.post(
                "https://fed-medical-clinic-api.vercel.app/prescriptions", // API URL
                payload, // The payload to send
                {
                    headers: { Authorization: `Bearer ${token}` }, // Send token for authentication
                }
            );
    
            console.log("API Response:", response.data); // Debugging
    
            // Navigate to the patient details page with a success message
            navigate(`/patient/${payload.patient_id}`, {
                state: { success: "Prescription successfully created!" },
            });
        } catch (err) {
            console.error("Error creating prescription:", err);
    
            if (err.response) {
                console.error("API error response:", JSON.stringify(err.response.data, null, 2));
                setError(err.response.data.error || "An unknown error occurred.");
            } else {
                setError("Network error or no response from server.");
            }
        }
    };

    return (
        <Container className="create-form-container my-5">
            <h1>Create Prescription</h1>
            {error && <Alert variant="danger">{error}</Alert>} {/* Show error message if any */}
            <Form onSubmit={handleSubmit} className="create-form p-4 rounded shadow">
                {/* Medication Input */}
                <Form.Group controlId="formMedication" className="mb-3">
                    <Form.Label>Medication</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter medication"
                        name="medication"
                        value={form.medication}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {/* Dosage Input */}
                <Form.Group controlId="formDosage" className="mb-3">
                    <Form.Label>Dosage</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter dosage"
                        name="dosage"
                        value={form.dosage}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {/* Start Date Input */}
                <Form.Group controlId="formStartDate" className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter start date (ddmmyy)"
                        name="start_date"
                        value={form.start_date}
                        onChange={handleChange}
                        maxLength={6}
                        required
                    />
                </Form.Group>

                {/* End Date Input */}
                <Form.Group controlId="formEndDate" className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter end date (ddmmyy)"
                        name="end_date"
                        value={form.end_date}
                        onChange={handleChange}
                        maxLength={6}
                        required
                    />
                </Form.Group>

                {/* Diagnosis ID (read-only) */}
                <Form.Group controlId="formDiagnosisId" className="mb-3">
                    <Form.Label>Diagnosis ID</Form.Label>
                    <Form.Control
                        type="text"
                        name="diagnosis_id"
                        value={form.diagnosis_id}
                        readOnly
                    />
                </Form.Group>

                {/* Patient ID (read-only) */}
                <Form.Group controlId="formPatientId" className="mb-3">
                    <Form.Label>Patient ID</Form.Label>
                    <Form.Control
                        type="text"
                        name="patient_id"
                        value={form.patient_id}
                        readOnly
                    />
                </Form.Group>

                {/* Doctor Dropdown */}
                <Form.Group controlId="formDoctorId" className="mb-3">
                    <Form.Label>Doctor</Form.Label>
                    <DoctorDropDown
                        selectedDoctorId={form.doctor_id}
                        onDoctorChange={handleDoctorChange} // Handle doctor selection
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

export default Create; // Export the Create component for use elsewhere in the app
