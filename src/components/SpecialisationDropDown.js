import React from 'react';
import { Form } from 'react-bootstrap';

const SpecialisationDropDown = ({ selectedSpecialisation, onSpecialisationChange }) => {
    const specialisations = [
        "Podiatrist", "Dermatologist", "Pediatrician", 
        "Psychiatrist", "General Practitioner"
    ];

    return (
        <Form.Control
            as="select"
            value={selectedSpecialisation}
            onChange={(e) => onSpecialisationChange(e.target.value)}
        >
            <option value="">Select specialisation</option>
            {specialisations.map((specialisation) => (
                <option key={specialisation} value={specialisation}>
                    {specialisation}
                </option>
            ))}
        </Form.Control>
    );
};

export default SpecialisationDropDown;