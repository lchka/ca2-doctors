import React from 'react';
import { AiOutlineRight } from 'react-icons/ai'; // Import the arrow icon from react-icons
import "../styles/Button.scss";

const Button = () => {
  return (
      <button type="button" className="btn rounded-5 orderNow">
        <div className="d-inline-flex align-items-center">
          <div
            className="arrowRounded rounded-circle bg-light text-dark d-flex justify-content-center align-items-center"
            style={{ width: '35px', height: '35px' }}
          >
            <AiOutlineRight size={20} color="black" /> {/* Using the React icon here */}
          </div>
          <span className="contentText ms-1 fs-5 fw-semibold">Get an Appointment</span>
        </div>
      </button>
  );
};

export default Button;
