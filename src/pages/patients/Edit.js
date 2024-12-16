import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useAuth } from "../../utils/useAuth";

const Edit = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    address: "",
  });
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    // Fetch the patient's details to populate the form
    const fetchPatient = async () => {
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
        console.error("Error fetching patient:", error);
        setError("Error fetching patient data");
      }
    };

    if (id && token) {
      fetchPatient();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with values:", form); // Debugging: Log form data on submit

    try {
      const response = await axios.patch(
        `https://fed-medical-clinic-api.vercel.app/patients/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Debugging: Log the response after the update
      console.log("Update response:", response);

      // Navigate to the single patient's details page after successful update
      navigate(`/patient/${id}`); // Navigate to the single patient's page
    } catch (err) {
      console.error("Error updating patient:", err);
      setError("Error updating patient");
    }
  };

  return (
    <Container className="mt-4">
      <h1>Edit Patient</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {Object.keys(validationErrors).length > 0 && (
        <Alert variant="danger">
          {Object.values(validationErrors).map((errorMsg, index) => (
            <div key={index}>{errorMsg}</div>
          ))}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            isInvalid={validationErrors.first_name}
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.first_name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter last name"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            isInvalid={validationErrors.last_name}
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.last_name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={form.email}
            onChange={handleChange}
            isInvalid={validationErrors.email}
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formPhone">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter phone number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            isInvalid={validationErrors.phone}
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.phone}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formDateOfBirth">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter date of birth (ddmmyy)"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            isInvalid={validationErrors.date_of_birth}
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.date_of_birth ||
              "Date of Birth must be in ddmmyy format (6 digits)"}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            Please double-check the date of birth and ensure it's entered in
            ddmmyy format. If in doubt, please re-enter it.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            name="address"
            value={form.address}
            onChange={handleChange}
            isInvalid={validationErrors.address}
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.address}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Update
        </Button>
      </Form>
    </Container>
  );
};

export default Edit;
