import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../utils/useAuth";
import "../../styles/CreateForm.scss"; // Import the SCSS file for consistent form styling

const EditDiagnosis = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patient_id: "",
    condition: "",
    diagnosis_date: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const response = await axios.get(
          `https://fed-medical-clinic-api.vercel.app/diagnoses/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setForm(response.data);
      } catch (error) {
        console.error("Error fetching diagnosis:", error);
        setError("Error fetching diagnosis");
      }
    };

    fetchDiagnosis();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `https://fed-medical-clinic-api.vercel.app/diagnoses/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(`/patient/${form.patient_id}`, { state: { success: 'Diagnosis updated successfully.' } }); // Navigate back to the single patient page with success message
    } catch (error) {
      console.error("Error updating diagnosis:", error);
      setError(
        error.response
          ? error.response.data.message
          : "Error updating diagnosis"
      );
    }
  };

  return (
    <Container className="create-form-container my-5">
      <h1>Edit Diagnosis</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} className="create-form p-4 rounded shadow">
        <Form.Group controlId="formPatientId" className="mb-3">
          <Form.Label>Patient ID</Form.Label>
          <Form.Control
            type="text"
            name="patient_id"
            value={form.patient_id}
            readOnly
          />
        </Form.Group>

        <Form.Group controlId="formCondition" className="mb-3">
          <Form.Label>Condition</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter condition"
            name="condition"
            value={form.condition}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formDiagnosisDate" className="mb-3">
          <Form.Label>Diagnosis Date</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter diagnosis date"
            name="diagnosis_date"
            value={form.diagnosis_date}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Update
        </Button>
      </Form>
    </Container>
  );
};

export default EditDiagnosis;