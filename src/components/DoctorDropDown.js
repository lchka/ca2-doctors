import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';

const DoctorDropdown = ({ selectedDoctorId, onDoctorChange }) => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('https://fed-medical-clinic-api.vercel.app/doctors');
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <Form.Control
      as="select"
      value={selectedDoctorId}
      onChange={(e) => onDoctorChange(e.target.value)}
      required
    >
      <option value="">Select a doctor</option>
      {doctors.map((doctor) => (
        <option key={doctor.id} value={doctor.id}>
          {doctor.id} - {doctor.first_name} {doctor.last_name}
        </option>
      ))}
    </Form.Control>
  );
};

export default DoctorDropdown;