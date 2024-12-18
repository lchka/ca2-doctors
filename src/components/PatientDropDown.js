import React, { useState, useEffect } from 'react'; // Import necessary hooks from React
import axios from 'axios'; // Import axios for making HTTP requests
import { Form } from 'react-bootstrap'; // Import Form component from React-Bootstrap

// Component: PatientDropdown
// Props: 
// - selectedPatientId: The currently selected patient ID
// - onPatientChange: Callback to handle patient selection changes
const PatientDropdown = ({ selectedPatientId, onPatientChange }) => {
  const [patients, setPatients] = useState([]); // State to store the list of patients

  // useEffect to fetch patients when the component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Fetch patient data from the API
        const response = await axios.get('https://fed-medical-clinic-api.vercel.app/patients');
        setPatients(response.data); // Update state with the fetched patients
      } catch (error) {
        // Handle any errors during the fetch
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients(); // Call the function to fetch patients
  }, []); // Empty dependency array ensures this runs only once, when the component mounts

  return (
    // Dropdown for selecting a patient
    <Form.Control
      as="select" // Render as a dropdown select element
      value={selectedPatientId} // Bind to the selectedPatientId prop
      onChange={(e) => onPatientChange(e.target.value)} // Handle selection change
      required // Ensure a selection is required
    >
      <option value="">Select a patient</option> {/* Default placeholder option */}
      {patients.map((patient) => (
        // Render an option for each patient
        <option key={patient.id} value={patient.id}>
          {patient.id} - {patient.first_name} {patient.last_name}
        </option>
      ))}
    </Form.Control>
  );
};

export default PatientDropdown; // Export the component for use in other files
