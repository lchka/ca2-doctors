import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';

const PatientDropdown = ({ selectedPatientId, onPatientChange }) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('https://fed-medical-clinic-api.vercel.app/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <Form.Control
      as="select"
      value={selectedPatientId}
      onChange={(e) => onPatientChange(e.target.value)}
      required
    >
      <option value="">Select a patient</option>
      {patients.map((patient) => (
        <option key={patient.id} value={patient.id}>
          {patient.id} - {patient.first_name} {patient.last_name}
        </option>
      ))}
    </Form.Control>
  );
};

export default PatientDropdown;