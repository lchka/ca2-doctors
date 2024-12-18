import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../utils/useAuth";
import "../../styles/CreateForm.scss"; // Import the SCSS file for consistent form styling

const EditDiagnosis = () => {
  const { token } = useAuth(); // Access the authentication token
  const { id } = useParams(); // Get the diagnosis ID from URL params
  const navigate = useNavigate(); // Navigate to different pages
  const [form, setForm] = useState({
    patient_id: "", // Patient ID for the diagnosis
    condition: "", // The medical condition diagnosed
    diagnosis_date: "", // Date of diagnosis
  });
  const [error, setError] = useState(null); // State for handling errors

  useEffect(() => {
    // Fetch existing diagnosis data on component mount
    const fetchDiagnosis = async () => {
      try {
        const response = await axios.get(
          `https://fed-medical-clinic-api.vercel.app/diagnoses/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the header for authentication
            },
          }
        );
        setForm(response.data); // Set the form data with the fetched diagnosis
      } catch (error) {
        console.error("Error fetching diagnosis:", error); // Log error
        setError("Error fetching diagnosis"); // Set error state
      }
    };

    fetchDiagnosis(); // Call the function to fetch data
  }, [id, token]); // Run the effect when `id` or `token` changes

  const handleChange = (e) => {
    // Handle form field changes
    setForm({
      ...form, // Keep the previous state
      [e.target.name]: e.target.value, // Update the specific field that was changed
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Send a PATCH request to update the diagnosis
      await axios.patch(
        `https://fed-medical-clinic-api.vercel.app/diagnoses/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token for authentication
          },
        }
      );
      // Redirect to the patient's page with a success message
      navigate(`/patient/${form.patient_id}`, { state: { success: 'Diagnosis updated successfully.' } });
    } catch (error) {
      console.error("Error updating diagnosis:", error); // Log error
      setError(
        error.response
          ? error.response.data.message
          : "Error updating diagnosis" // Show specific error message if available
      );
    }
  };

  return (
    <Container className="create-form-container my-5">
      <h1>Edit Diagnosis</h1>
      {error && <Alert variant="danger">{error}</Alert>} {/* Display error if any */}
      <Form onSubmit={handleSubmit} className="create-form p-4 rounded shadow">
        {/* Patient ID (read-only) */}
        <Form.Group controlId="formPatientId" className="mb-3">
          <Form.Label>Patient ID</Form.Label>
          <Form.Control
            type="text"
            name="patient_id"
            value={form.patient_id}
            readOnly // This field is read-only
          />
        </Form.Group>

        {/* Medical Condition Input */}
        <Form.Group controlId="formCondition" className="mb-3">
          <Form.Label>Condition</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter condition"
            name="condition"
            value={form.condition}
            onChange={handleChange} // Update the state when the input changes
            required
          />
        </Form.Group>

        {/* Diagnosis Date Input */}
        <Form.Group controlId="formDiagnosisDate" className="mb-3">
          <Form.Label>Diagnosis Date</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter diagnosis date"
            name="diagnosis_date"
            value={form.diagnosis_date}
            onChange={handleChange} // Update the state when the input changes
            required
          />
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit" className="mt-3">
          Update
        </Button>
      </Form>
    </Container>
  );
};

export default EditDiagnosis; // Export the component to use in other parts of the application
