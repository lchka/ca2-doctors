import React from 'react';
import { Form } from 'react-bootstrap';

const DoctorDropDown = ({ doctors, selectedDoctorId, onDoctorSelect }) => {
    return (
        <Form.Group controlId="formDoctor">
            <Form.Label>Doctor</Form.Label>
            <Form.Control
                as="select"
                value={selectedDoctorId}
                onChange={(e) => {
                    const selectedId = e.target.value;
                    console.log('Selected doctor ID:', selectedId); // Log the selected doctor ID
                    onDoctorSelect(selectedId);
                }}
            >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                        {doctor.id} {doctor.name}
                    </option>
                ))}
            </Form.Control>
        </Form.Group>
    );
};

export default DoctorDropDown;
