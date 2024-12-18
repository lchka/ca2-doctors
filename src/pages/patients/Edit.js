import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../utils/useAuth";
import "../../styles/CreateForm.scss"; // Reuse the SCSS file for consistent form styling

const EditPatient = () => {
  const { token } = useAuth(); // Get the authentication token
  const { id } = useParams(); // Get the patient ID from the URL
  const navigate = useNavigate(); // For navigation after submission
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
  });
  const [validationErrors, setValidationErrors] = useState({}); // State for form validation errors
  const [error, setError] = useState(null); // State for general error messages

  // Fetch the patient data when the component loads
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
        setForm(response.data); // Set the fetched patient data into the form state
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError("Error fetching patient data"); // Set error if fetching fails
      }
    };

    fetchPatientData(); // Call the fetch function
  }, [id, token]);

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value, // Update the form state based on input changes
    }));
  };

  // Validate the form before submission
  const validateForm = () => {
    const errors = {};
    // Add validation checks for each form field
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
    return errors; // Return the validation errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const errors = validateForm(); // Validate the form fields
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors); // Set validation errors if any
      console.error("Validation errors:", errors);
      return; // Exit the function if there are validation errors
    }
  
    try {
      // Send a PATCH request to update the patient details
      await axios.patch(
        `https://fed-medical-clinic-api.vercel.app/patients/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Navigate to the patient details page with a success message
      navigate(`/patient/${id}`, { state: { success: 'Patient successfully updated!' } });
    } catch (error) {
      console.error("Error updating patient data:", error);
      // Handle errors based on the response from the API
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error.issues.map(issue => issue.message).join(', ')); // Show validation errors from server
      } else if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Display the server message if available
      } else {
        setError("Error updating patient data"); // Generic error message
      }
    }
  };

  return (
    <Container className="create-form-container my-5">
      <h1>Edit Patient</h1>
      {error && <Alert variant="danger">{error}</Alert>} {/* Display general error if any */}
      <Form onSubmit={handleSubmit} className="create-form p-4 rounded shadow">
        {/* First Name Field */}
        <Form.Group controlId="formFirstName" className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            isInvalid={validationErrors.first_name} // Display error if invalid
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.first_name} {/* Show validation error */}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Last Name Field */}
        <Form.Group controlId="formLastName" className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter last name"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            isInvalid={validationErrors.last_name} // Display error if invalid
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.last_name} {/* Show validation error */}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Email Field */}
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={form.email}
            onChange={handleChange}
            isInvalid={validationErrors.email} // Display error if invalid
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.email} {/* Show validation error */}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Phone Field */}
        <Form.Group controlId="formPhone" className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter phone number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            isInvalid={validationErrors.phone} // Display error if invalid
            maxLength={10}
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.phone} {/* Show validation error */}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Date of Birth Field */}
        <Form.Group controlId="formDateOfBirth" className="mb-3">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter date of birth (ddmmyy)"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            isInvalid={validationErrors.date_of_birth} // Display error if invalid
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.date_of_birth} {/* Show validation error */}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit" className="btn-primary text-uppercase fw-semibold w-100">
          Update Patient
        </Button>
      </Form>
    </Container>
  );
};

export default EditPatient; // Export the EditPatient component for use elsewhere in the app
