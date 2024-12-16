import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';
import DoctorDropDown from '../../components/DoctorDropDown';

const Create = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the diagnosis_id and patient_id from the URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const diagnosis_id = queryParams.get('diagnosis_id');
    const patient_id = queryParams.get('patient_id');

    const [form, setForm] = useState({
        medication: '',
        dosage: '',
        start_date: '',  // Keep as string
        end_date: '',    // Keep as string
        diagnosis_id: diagnosis_id || '', // Prefill the diagnosis_id from the URL
        patient_id: patient_id || '', // Prefill the patient_id from the URL
        doctor_id: '', // New field for doctor_id
    });

    const [doctors, setDoctors] = useState([]); // Store the list of doctors
    const [error, setError] = useState(null); // To store API error messages

    // Fetch doctors from the API (replace with your actual API endpoint)
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('https://fed-medical-clinic-api.vercel.app/doctors', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setDoctors(response.data); // Assuming the response contains an array of doctor objects
            } catch (err) {
                console.error("Error fetching doctors:", err);
                setError("Failed to load doctors.");
            }
        };

        fetchDoctors();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // If the field is diagnosis_id, patient_id, or doctor_id, ensure the value is an integer
        if (name === 'diagnosis_id' || name === 'patient_id' || name === 'doctor_id') {
            // Only set the value if it's an integer
            if (value === '' || /^[0-9\b]+$/.test(value)) {
                setForm({
                    ...form,
                    [name]: value
                });
            }
        } else {
            setForm({
                ...form,
                [name]: value
            });
        }
    };

    const handleDoctorSelect = (doctorId) => {
        console.log('Selected doctor ID in handleDoctorSelect:', doctorId);  // Log selected doctor ID
        setForm({
            ...form,
            doctor_id: doctorId,  // Set doctor_id as the selected doctor ID (number)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Debugging message: Log the form data before submission
        console.log('Form data before submission:', form);

        // Convert the numeric fields to numbers before submission
        const formData = {
            ...form,
            diagnosis_id: Number(form.diagnosis_id),
            patient_id: Number(form.patient_id),
            doctor_id: Number(form.doctor_id),  // Ensure doctor_id is a number
        };

        try {
            // Post request to create prescription
            await axios.post('https://fed-medical-clinic-api.vercel.app/prescriptions', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Debugging message: Log successful submission
            console.log('Prescription created successfully.');

            navigate(`/diagnoses/${form.diagnosis_id}`); // Navigate back to the diagnosis page after successful creation
        } catch (error) {
            // Debugging message: Log error response
            console.error('Error creating prescription:', error.response ? error.response.data : error);

            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message); // Set the API validation message
            } else {
                setError('An error occurred while creating the prescription.'); // General error message
            }
        }
    };

    return (
        <Container className="mt-4">
            <h1>Create Prescription</h1>
            {error && <Alert variant="danger">{error}</Alert>}  {/* Display error message here */}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formMedication">
                    <Form.Label>Medication</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter medication"
                        name="medication"
                        value={form.medication}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formDosage">
                    <Form.Label>Dosage</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter dosage"
                        name="dosage"
                        value={form.dosage}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formStartDate">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                        type="text"  // Changed from date to text
                        placeholder="Enter start date (e.g., YYYY-MM-DD)"
                        name="start_date"
                        value={form.start_date}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formEndDate">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                        type="text"  // Changed from date to text
                        placeholder="Enter end date (e.g., YYYY-MM-DD)"
                        name="end_date"
                        value={form.end_date}
                        onChange={handleChange}
                    />
                </Form.Group>

                {/* Diagnosis ID input field with integer validation */}
                <Form.Group controlId="formDiagnosisId">
                    <Form.Label>Diagnosis ID</Form.Label>
                    <Form.Control
                        type="number" // Changed to type="number" to accept integers only
                        placeholder="Enter Diagnosis ID"
                        name="diagnosis_id"
                        value={form.diagnosis_id}
                        onChange={handleChange}
                        readOnly
                    />
                </Form.Group>

                {/* Patient ID input field with integer validation */}
                <Form.Group controlId="formPatientId">
                    <Form.Label>Patient ID</Form.Label>
                    <Form.Control
                        type="number" // Changed to type="number" to accept integers only
                        placeholder="Enter Patient ID"
                        name="patient_id"
                        value={form.patient_id}
                        onChange={handleChange}
                        readOnly
                    />
                </Form.Group>

                {/* Doctor ID dropdown */}
                <DoctorDropDown
                    doctors={doctors}
                    selectedDoctorId={form.doctor_id}
                    onDoctorSelect={handleDoctorSelect}
                />

                <Button variant="primary" type="submit" className="mt-3">
                    Create Prescription
                </Button>
            </Form>
        </Container>
    );
};

export default Create;
