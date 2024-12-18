import React from 'react'; // Import React
import { Form } from 'react-bootstrap'; // Import Form component from React-Bootstrap

// Component: SpecialisationDropDown
// Props:
// - selectedSpecialisation: The currently selected specialisation
// - onSpecialisationChange: Callback to handle changes in the selected specialisation
const SpecialisationDropDown = ({ selectedSpecialisation, onSpecialisationChange }) => {
    // List of specialisations for the dropdown
    const specialisations = [
        "Podiatrist", 
        "Dermatologist", 
        "Pediatrician", 
        "Psychiatrist", 
        "General Practitioner"
    ];

    return (
        // Dropdown for selecting a specialisation
        <Form.Control
            as="select" // Render as a dropdown select element
            value={selectedSpecialisation} // Bind to the selectedSpecialisation prop
            onChange={(e) => onSpecialisationChange(e.target.value)} // Handle selection change
        >
            <option value="">Select specialisation</option> {/* Default placeholder option */}
            {specialisations.map((specialisation) => (
                // Render an option for each specialisation
                <option key={specialisation} value={specialisation}>
                    {specialisation}
                </option>
            ))}
        </Form.Control>
    );
};

export default SpecialisationDropDown; // Export the component for use in other files
