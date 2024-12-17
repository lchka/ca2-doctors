import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import DoctorDropdown from '../../components/DoctorDropDown';
import PatientDropdown from '../../components/PatientDropDown';
import '../../styles/CreateForm.scss';

const Edit = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { id } = useParams();

  const [form, setForm] = useState({
    patient_id: '',
    appointment_date: '',
    doctor_id: '',
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        console.log(`Fetching appointment with ID: ${id}`);
        console.log(`Using token: ${token}`);
        const response = await axios.get(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setForm(response.data);
      } catch (error) {
        console.error('Error fetching appointment:', error);
        setError('Error fetching appointment');
      }
    };

    fetchAppointment();
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

  const handlePatientChange = (patient_id) => {
    setForm({
      ...form,
      patient_id,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(`Updating appointment with ID: ${id}`);
      console.log(`Form data:`, form);
      await axios.patch(`https://fed-medical-clinic-api.vercel.app/appointment/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/appointments', { state: { success: 'Appointment successfully updated!' } });
    } catch (err) {
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

  return (
    <Container className="create-form-container my-5">
      <h2 className="text-center mb-4">Edit Appointment</h2>
      {error && <Alert variant="danger" className="text-center">{error}</Alert>}
      <Form onSubmit={handleSubmit} className="create-form p-4 rounded shadow">
        <Form.Group controlId="formPatientId" className="mb-3">
          <Form.Label>Patient</Form.Label>
          <PatientDropdown
            selectedPatientId={form.patient_id}
            onPatientChange={handlePatientChange}
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
          Update
        </Button>
      </Form>
    </Container>
  );
};

export default Edit;