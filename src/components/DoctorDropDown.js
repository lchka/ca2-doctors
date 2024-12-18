import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';

// Define a functional component named DoctorDropdown
const DoctorDropdown = ({ selectedDoctorId, onDoctorChange }) => {
  // State to store the list of doctors
  const [doctors, setDoctors] = useState([]);

  // useEffect hook to fetch the list of doctors when the component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Make an API call to fetch the list of doctors
        const response = await axios.get('https://fed-medical-clinic-api.vercel.app/doctors');
        // Update the state with the fetched doctors
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    // Call the fetchDoctors function
    fetchDoctors();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    // Render a Form.Control component as a dropdown (select) element
    <Form.Control
      as="select"
      value={selectedDoctorId} // Set the selected value
      onChange={(e) => onDoctorChange(e.target.value)} // Handle change event
      required
    >
      {/* Default option */}
      <option value="">Select a doctor</option>
      {/* Map over the list of doctors and render an option for each */}
      {doctors.map((doctor) => (
        <option key={doctor.id} value={doctor.id}>
          {doctor.id} - {doctor.first_name} {doctor.last_name}
        </option>
      ))}
    </Form.Control>
  );
};

// Export the DoctorDropdown component as the default export
export default DoctorDropdown;