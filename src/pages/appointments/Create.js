import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth'; // Custom authentication hook
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import DoctorDropdown from '../../components/DoctorDropDown'; // Dropdown component for doctor selection
import PatientDropdown from '../../components/PatientDropDown'; // Dropdown component for patient selection
import '../../styles/CreateForm.scss';

// Component for creating an appointment
const Create = () => {
  const navigate = useNavigate(); // Hook for navigation
  const { token } = useAuth(); // Authentication token

  // State for form data
  const [form, setForm] = useState({
    patient_id: '', // Patient ID selected from dropdown
    appointment_date: '', // Appointment date input by the user
    doctor_id: '', // Doctor ID selected from dropdown
  });

  const [error, setError] = useState(null); // State for storing error messages

  // Redirect unauthenticated users to the registration page
  useEffect(() => {
    if (!token) {
      navigate('/register');
    }
  }, [token, navigate]);

  // Handle input changes for regular form fields
  const handleChange = (e) => {
    setForm({
      ...form, // Preserve the existing form state
      [e.target.name]: e.target.value, // Update the specific field
    });
  };

  // Update doctor ID when the dropdown selection changes
  const handleDoctorChange = (doctor_id) => {
    setForm({
      ...form,
      doctor_id: Number(doctor_id), // Ensure the doctor ID is a number
    });
  };

  // Update patient ID when the dropdown selection changes
  const handlePatientChange = (patient_id) => {
    setForm({
      ...form,
      patient_id: Number(patient_id), // Ensure the patient ID is a number
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Send POST request to create an appointment
      const response = await axios.post(
        'https://fed-medical-clinic-api.vercel.app/appointments',
        {
          ...form,
          patient_id: Number(form.patient_id), // Ensure IDs are numbers
          doctor_id: Number(form.doctor_id),
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Include authorization header
        }
      );

      console.log('Appointment created:', response.data);

      // Redirect to the appointments page with a success message
      navigate('/appointments', {
        state: { success: 'Appointment successfully created!' },
      });
    } catch (err) {
      // Handle and display error messages
      if (err.response && err.response.data && err.response.data.error) {
        // Map server-side validation errors
        setError(
          err.response.data.error.issues
            .map((issue) => issue.message)
            .join(', ')
        );
      } else {
        // Display generic error message
        setError('Failed to create appointment. Please try again.');
      }
      console.error('Error creating appointment:', err.response ? err.response.data : err);
    }
  };

  return (
    <Container className="create-form-container my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          {/* Display error message if an error occurs */}
          {error && <Alert variant="danger" className="text-center">{error}</Alert>}

          {/* Appointment creation form */}
          <Form onSubmit={handleSubmit} className="create-form p-4 rounded shadow">
            <h2 className="text-center mb-4">Create Appointment</h2>

            {/* Patient dropdown */}
            <Form.Group controlId="formPatientId" className="mb-3">
              <Form.Label>Patient</Form.Label>
              <PatientDropdown
                selectedPatientId={form.patient_id} // Pass selected patient ID
                onPatientChange={handlePatientChange} // Handle patient selection change
              />
            </Form.Group>

            {/* Appointment date input */}
            <Form.Group controlId="formAppointmentDate" className="mb-3">
              <Form.Label>Appointment Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="Format: ddmmyy" // Expected date format
                name="appointment_date"
                value={form.appointment_date}
                onChange={handleChange} // Handle date input change
                required
              />
            </Form.Group>

            {/* Doctor dropdown */}
            <Form.Group controlId="formDoctorId" className="mb-3">
              <Form.Label>Doctor</Form.Label>
              <DoctorDropdown
                selectedDoctorId={form.doctor_id} // Pass selected doctor ID
                onDoctorChange={handleDoctorChange} // Handle doctor selection change
              />
            </Form.Group>

            {/* Submit button */}
            <Button variant="primary" type="submit" className="w-100">
              Create
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Create;
