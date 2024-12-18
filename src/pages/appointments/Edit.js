import React, { useState, useEffect } from 'react'; // Import React hooks
import { useNavigate, useParams } from 'react-router-dom'; // Import navigation and params hooks
import { useAuth } from '../../utils/useAuth'; // Import custom authentication hook
import { Form, Button, Container, Alert } from 'react-bootstrap'; // Import Bootstrap components
import axios from 'axios'; // Import axios for HTTP requests
import DoctorDropdown from '../../components/DoctorDropDown'; // Import DoctorDropdown component
import PatientDropdown from '../../components/PatientDropDown'; // Import PatientDropdown component
import '../../styles/CreateForm.scss'; // Import custom styles

// Component: Edit
// Purpose: Allows editing an existing appointment
const Edit = () => {
  const navigate = useNavigate(); // Hook for navigation
  const { token } = useAuth(); // Get authentication token
  const { id } = useParams(); // Get appointment ID from URL parameters

  // State for managing the form fields
  const [form, setForm] = useState({
    patient_id: '', // Selected patient ID
    appointment_date: '', // Appointment date
    doctor_id: '', // Selected doctor ID
  });

  const [error, setError] = useState(null); // State for error messages

  // Fetch the existing appointment data on component mount
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        console.log(`Fetching appointment with ID: ${id}`);
        console.log(`Using token: ${token}`);
        const response = await axios.get(
          `https://fed-medical-clinic-api.vercel.app/appointments/${id}`, 
          { headers: { Authorization: `Bearer ${token}` } } // Pass token in headers
        );
        setForm(response.data); // Populate the form with fetched data
      } catch (error) {
        console.error('Error fetching appointment:', error);
        setError('Error fetching appointment'); // Set error message if fetching fails
      }
    };

    fetchAppointment();
  }, [id, token]); // Dependencies: run effect when `id` or `token` changes

  // Handle generic input field changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value, // Update the field matching the input's name
    });
  };

  // Handle doctor dropdown changes
  const handleDoctorChange = (doctor_id) => {
    setForm({
      ...form,
      doctor_id, // Update doctor ID
    });
  };

  // Handle patient dropdown changes
  const handlePatientChange = (patient_id) => {
    setForm({
      ...form,
      patient_id, // Update patient ID
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      console.log(`Updating appointment with ID: ${id}`);
      console.log(`Form data:`, form);
      await axios.patch(
        `https://fed-medical-clinic-api.vercel.app/appointment/${id}`, 
        form, 
        { headers: { Authorization: `Bearer ${token}` } } // Pass token in headers
      );
      // Navigate to appointments page on success with a success message
      navigate('/appointments', { state: { success: 'Appointment successfully updated!' } });
    } catch (err) {
      // Handle different types of errors from the API
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error.issues.map(issue => issue.message).join(', '));
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update appointment. Please try again.');
      }
      console.error('Error updating appointment:', err.response ? err.response.data : err);
    }
  };

  // Render the form for editing the appointment
  return (
    <Container className="create-form-container my-5">
      <h2 className="text-center mb-4">Edit Appointment</h2>
      {error && <Alert variant="danger" className="text-center">{error}</Alert>} {/* Display error if any */}
      <Form onSubmit={handleSubmit} className="create-form p-4 rounded shadow">
        <Form.Group controlId="formPatientId" className="mb-3">
          <Form.Label>Patient</Form.Label>
          <PatientDropdown
            selectedPatientId={form.patient_id} // Pass current patient ID
            onPatientChange={handlePatientChange} // Pass handler for updating patient ID
          />
        </Form.Group>
        <Form.Group controlId="formAppointmentDate" className="mb-3">
          <Form.Label title="Make sure to replace with the correct date in the format ddmmyy">
            Appointment Date
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Format: ddmmyy"
            name="appointment_date"
            value={form.appointment_date} // Bind to the appointment_date state
            onChange={handleChange} // Update state on change
            required // Make the field mandatory
          />
        </Form.Group>
        <Form.Group controlId="formDoctorId" className="mb-3">
          <Form.Label>Doctor</Form.Label>
          <DoctorDropdown
            selectedDoctorId={form.doctor_id} // Pass current doctor ID
            onDoctorChange={handleDoctorChange} // Pass handler for updating doctor ID
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Update
        </Button>
      </Form>
    </Container>
  );
};

export default Edit; // Export the component
