import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../utils/useAuth";
import "../../styles/CreateForm.scss"; // Reuse the SCSS file for consistent form styling

const EditPatient = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `https://fed-medical-clinic-api.vercel.app/patients/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setForm(response.data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError("Error fetching patient data");
      }
    };

    fetchPatientData();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!form.first_name) errors.first_name = "First name is required";
    if (!form.last_name) errors.last_name = "Last name is required";
    if (!form.email) {
      errors.email = "Email is required";
    } else if (!/@/.test(form.email)) {
      errors.email = "Email must contain an '@' sign";
    }
    if (!form.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      errors.phone = "Phone number must be 10 digits";
    }
    if (!form.date_of_birth) {
      errors.date_of_birth = "Date of birth is required";
    } else if (!/^\d{6}$/.test(form.date_of_birth)) {
      errors.date_of_birth = "Date of birth must be in ddmmyy format";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      console.error("Validation errors:", errors);
      return;
    }
  
    try {
      await axios.patch(
        `https://fed-medical-clinic-api.vercel.app/patients/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(`/patient/${id}`, { state: { success: 'Patient successfully updated!' } });
    } catch (error) {
      console.error("Error updating patient data:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error.issues.map(issue => issue.message).join(', '));
      } else if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Error updating patient data");
      }
    }
  };
  return (
    <Container className="create-form-container my-5">
      <h1>Edit Patient</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} className="create-form p-4 rounded shadow">
        <Form.Group controlId="formFirstName" className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            isInvalid={validationErrors.first_name}
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.first_name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formLastName" className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter last name"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            isInvalid={validationErrors.last_name}
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.last_name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={form.email}
            onChange={handleChange}
            isInvalid={validationErrors.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formPhone" className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter phone number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            isInvalid={validationErrors.phone}
            maxLength={10}
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.phone}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formDateOfBirth" className="mb-3">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter date of birth (ddmmyy)"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            isInvalid={validationErrors.date_of_birth}
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.date_of_birth}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className=" btn-primary text-uppercase fw-semibold w-100">
          Update Patient
        </Button>
      </Form>
    </Container>
  );
};

export default EditPatient;