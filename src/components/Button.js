import React from 'react';
import { AiOutlineRight } from 'react-icons/ai'; // Import the arrow icon from react-icons
import "../styles/Button.scss"; // Import the custom styles for the button

// Define a functional component named Button
const Button = () => {
  return (
    // Render a button element with custom classes and styles
    <button type="button" className="btn rounded-5 orderNow">
      <div className="d-inline-flex align-items-center">
        <div
          className="arrowRounded rounded-circle bg-light text-dark d-flex justify-content-center align-items-center"
          style={{ width: '35px', height: '35px' }}
        >
          {/* Use the AiOutlineRight icon from react-icons */}
          <AiOutlineRight size={20} color="black" />
        </div>
        {/* Render the button text */}
        <span className="contentText ms-1 fs-5 fw-semibold">Get an Appointment</span>
      </div>
    </button>
  );
};

// Export the Button component as the default export
export default Button;