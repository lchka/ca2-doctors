import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import DoctorDropdown from '../../components/DoctorDropDown';
import PatientDropdown from '../../components/PatientDropDown';
import '../../styles/CreateForm.scss';

const Create = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState({
    patient_id: '',
    appointment_date: '',
    doctor_id: '',
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/register');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleDoctorChange = (doctor_id) => {
    setForm({
      ...form,
      doctor_id: Number(doctor_id),
    });
  };

  const handlePatientChange = (patient_id) => {
    setForm({
      ...form,
      patient_id: Number(patient_id),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://fed-medical-clinic-api.vercel.app/appointments', {
        ...form,
        patient_id: Number(form.patient_id),
        doctor_id: Number(form.doctor_id),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Appointment created:', response.data);
      navigate('/appointments', { state: { success: 'Appointment successfully created!' } });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error.issues.map(issue => issue.message).join(', '));
      } else {
        setError('Failed to create appointment. Please try again.');
      }
      console.error('Error creating appointment:', err.response ? err.response.data : err);
    }
  };

  return (
    <Container className="create-form-container my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          {error && <Alert variant="danger" className="text-center">{error}</Alert>}
          <Form onSubmit={handleSubmit} className="create-form p-4 rounded shadow">
            <h2 className="text-center mb-4">Create Appointment</h2>
            <Form.Group controlId="formPatientId" className="mb-3">
              <Form.Label>Patient</Form.Label>
              <PatientDropdown
                selectedPatientId={form.patient_id}
                onPatientChange={handlePatientChange}
              />
            </Form.Group>
            <Form.Group controlId="formAppointmentDate" className="mb-3">
              <Form.Label>Appointment Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="Format: ddmmyy"
                name="appointment_date"
                value={form.appointment_date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDoctorId" className="mb-3">
              <Form.Label>Doctor</Form.Label>
              <DoctorDropdown
                selectedDoctorId={form.doctor_id}
                onDoctorChange={handleDoctorChange}
              />
            </Form.Group>
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