import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../utils/useAuth";
import DoctorDropDown from "../../components/DoctorDropDown";
import "../../styles/CreateForm.scss"; // Import SCSS for form styling

const EditPrescription = () => {
  const { token } = useAuth(); // Retrieve token from auth context for authorization
  const { id } = useParams(); // Get prescription ID from URL parameters
  const navigate = useNavigate(); // Hook for navigating to other pages
  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    medication: "",
    dosage: "",
    start_date: "",
    end_date: "",
  }); // State to manage form fields
  const [error, setError] = useState(null); // State to handle error messages

  useEffect(() => {
    // Fetch existing prescription data for editing
    const fetchPrescription = async () => {
      try {
        const response = await axios.get(
          `https://fed-medical-clinic-api.vercel.app/prescriptions/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched prescription data:", response.data); // Debugging log
        setForm(response.data); // Populate the form with fetched prescription data
      } catch (error) {
        console.error("Error fetching prescription:", error);
        setError("Error fetching prescription"); // Set error if API call fails
      }
    };

    fetchPrescription(); // Call function to fetch prescription data
  }, [id, token]); // Dependency array ensures this effect runs when id or token changes

  const handleChange = (e) => {
    // Handle changes in text input fields
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleDoctorChange = (doctor_id) => {
    // Handle change for doctor selection from dropdown
    setForm({
      ...form,
      doctor_id,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Convert necessary fields to numbers before submitting
    const payload = {
      ...form,
      patient_id: Number(form.patient_id),
      doctor_id: Number(form.doctor_id),
    };

    console.log("Form data before submission:", payload); // Debugging log

    try {
      const response = await axios.patch(
        `https://fed-medical-clinic-api.vercel.app/prescriptions/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data); // Debugging log
      navigate(`/patient/${form.patient_id}`); // Navigate to the patient's page after successful update
    } catch (error) {
      console.error("Error updating prescription:", error);

      // Handle error response from API
      if (error.response) {
        console.error(
          "Full API error response:",
          JSON.stringify(error.response.data, null, 2)
        );
        setError(error.response.data.error || "Error updating prescription"); // Display API error message
      } else {
        setError("Network error or no response from server."); // Display error if no response from the server
      }
    }
  };

  return (
    <Container className="create-form-container my-5">
      <h1>Edit Prescription</h1>
      {error && <Alert variant="danger">{error}</Alert>} {/* Display error message if exists */}
      <Form onSubmit={handleSubmit} className="create-form p-4 rounded shadow">
        <Form.Group controlId="formPatientId" className="mb-3">
          <Form.Label>Patient ID</Form.Label>
          <Form.Control
            type="number"
            name="patient_id"
            value={form.patient_id}
            readOnly
          />
        </Form.Group>

        <Form.Group controlId="formDoctorId" className="mb-3">
          <Form.Label>Doctor</Form.Label>
          <DoctorDropDown
            selectedDoctorId={form.doctor_id}
            onDoctorChange={handleDoctorChange} // Pass doctor selection handler to the dropdown
          />
        </Form.Group>

        <Form.Group controlId="formMedication" className="mb-3">
          <Form.Label>Medication</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter medication"
            name="medication"
            value={form.medication}
            onChange={handleChange} // Handle changes for medication field
            required
          />
        </Form.Group>

        <Form.Group controlId="formDosage" className="mb-3">
          <Form.Label>Dosage</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter dosage"
            name="dosage"
            value={form.dosage}
            onChange={handleChange} // Handle changes for dosage field
            required
          />
        </Form.Group>

        <Form.Group controlId="formStartDate" className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter start date (ddmmyy)"
            name="start_date"
            value={form.start_date}
            onChange={handleChange} // Handle changes for start date field
            required
          />
        </Form.Group>

        <Form.Group controlId="formEndDate" className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter end date (ddmmyy)"
            name="end_date"
            value={form.end_date}
            onChange={handleChange} // Handle changes for end date field
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Update
        </Button>
      </Form>
    </Container>
  );
};

export default EditPrescription;
