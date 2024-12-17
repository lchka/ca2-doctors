import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../utils/useAuth";
import DoctorDropDown from "../../components/DoctorDropDown";
import "../../styles/CreateForm.scss"; // Import the SCSS file for consistent form styling

const EditPrescription = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    medication: "",
    dosage: "",
    start_date: "",
    end_date: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
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
        setForm(response.data);
      } catch (error) {
        console.error("Error fetching prescription:", error);
        setError("Error fetching prescription");
      }
    };

    fetchPrescription();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleDoctorChange = (doctor_id) => {
    setForm({
      ...form,
      doctor_id,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      navigate(`/patient/${form.patient_id}`); // Navigate back after success
    } catch (error) {
      console.error("Error updating prescription:", error);

      if (error.response) {
        console.error(
          "Full API error response:",
          JSON.stringify(error.response.data, null, 2)
        );
        setError(error.response.data.error || "Error updating prescription");
      } else {
        setError("Network error or no response from server.");
      }
    }
  };

  return (
    <Container className="create-form-container my-5">
      <h1>Edit Prescription</h1>
      {error && <Alert variant="danger">{error}</Alert>}
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
            onDoctorChange={handleDoctorChange}
          />
        </Form.Group>

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

        <Form.Group controlId="formStartDate" className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter start date (ddmmyy)"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
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
            onChange={handleChange}
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
