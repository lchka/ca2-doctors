import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Alert, Spinner, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineRight, AiOutlineDown } from "react-icons/ai"; // Import downward arrow
import "../styles/Home.scss";
import { MdArrowDownward } from "react-icons/md"; // A different arrow component
import "../styles/Button.scss";
import { WiDaySunny, WiCloudy, WiRain } from "react-icons/wi"; // Weather icons from react-icons
import Video from "../images/videoDna.mp4"; // Import the video file

import doctorImage from "../images/doctor.jpg"; // Importing the image

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [buttonAnimate, setButtonAnimate] = useState(false); // State for button animation
  const [videoInView, setVideoInView] = useState(false); // State for video animation trigger
  const [doctors, setDoctors] = useState([]); // State for doctors data
  const [filteredDoctors, setFilteredDoctors] = useState([]); // State for filtered doctors (first 3)
  const [doctorsInView, setDoctorsInView] = useState(false); // State for doctors section animation trigger

  const msg = useLocation()?.state?.msg || null;
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true); // General animation trigger
    setTimeout(() => setButtonAnimate(true), 100); // Delay for button animation

    // Intersection Observer to detect when video comes into view
    const videoElement = document.querySelector(".videoAnimation video");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVideoInView(true); // Trigger video animation when it comes into view
        } else {
          setVideoInView(false); // Hide text if video is not in view
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the video is in view
    );

    if (videoElement) {
      observer.observe(videoElement);
    }

    // Intersection Observer to detect when doctors section comes into view
    const doctorsElement = document.querySelector(".doctors-section");
    const doctorsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDoctorsInView(true); // Trigger doctors animation when it comes into view
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the doctors section is in view
    );

    if (doctorsElement) {
      doctorsObserver.observe(doctorsElement);
    }

    // Fetch Weather
    const fetchWeather = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const locationRes = await axios.get(
              `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=8uh1KbPUUjS5ol77mdqnNb8gH1Hicy9H&q=${latitude},${longitude}`
            );
            const locationKey = locationRes.data.Key;

            const weatherRes = await axios.get(
              `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=8uh1KbPUUjS5ol77mdqnNb8gH1Hicy9H`
            );
            setWeather(weatherRes.data[0]);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching weather data:", error);
            setError("Error fetching weather data");
          }
        });
      }
    };

    fetchWeather();

    // Fetch Doctors
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "https://fed-medical-clinic-api.vercel.app/doctors?limit=3"
        );
        setDoctors(response.data);
        setFilteredDoctors(response.data.slice(0, 3)); // Set the first 3 doctors
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
      if (doctorsElement) {
        doctorsObserver.unobserve(doctorsElement);
      }
    };
  }, []);

  const handleAppointmentClick = () => {
    navigate("/appointments/create");
  };

  const handleScrollMoreClick = () => {
    window.scrollTo({
      top: window.innerHeight, // Scroll to the next section of the page
      behavior: "smooth",
    });
  };
  return (
    <Container className="mt-4">
      <Row>
        <Col
          md={12}
          className="d-flex slide-in-right-two animate-button justify-content-end"
        >
          <div className="weather-box p-3 rounded-5 border">
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {weather && (
              <div className="weather-info d-flex align-items-center">
                {/* Weather Icon on the left side */}
                <div className="weather-icon me-3">
                  {weather.WeatherText.toLowerCase().includes("sunny") && (
                    <WiDaySunny size={40} />
                  )}
                  {weather.WeatherText.toLowerCase().includes("cloudy") && (
                    <WiCloudy size={40} />
                  )}
                  {weather.WeatherText.toLowerCase().includes("rain") && (
                    <WiRain size={40} />
                  )}
                </div>
                {/* Weather Text and Temperature */}
                <div>
                  <h5 className="mb-2">{weather.WeatherText}</h5>
                  <p className="temperature mb-2">
                    <strong>
                      {weather.Temperature.Metric.Value}°{" "}
                      {weather.Temperature.Metric.Unit}
                    </strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>
      {msg && <Alert variant="info">{msg}</Alert>}
      <Row className="justify-content-center mb-4">
        {/* Left Column */}
        <Col
          md={5}
          className={`text-left mt-5 ${animate ? "slide-in-left" : ""}`}
        >
          <h1 className="gradient-text font-weight-bold">
            Dun Laoghaire Medical Center & Services
          </h1>
          <p className="lead fw-normal py-5 my-3">
            Dun Laoghaire Medical offers high-quality healthcare with a range of
            services, ensuring the community’s well-being through professional
            care.
          </p>

          {/* Appointment Button with Animation */}
          <button
            type="button"
            className={`btn rounded-5 orderNow my-2 ${
              buttonAnimate ? "animate-button" : ""
            }`}
            onClick={handleAppointmentClick}
          >
            <div className="d-inline-flex align-items-center">
              <div
                className="arrowRounded rounded-circle bg-primary text-dark d-flex justify-content-center align-items-center"
                style={{ width: "35px", height: "35px" }}
              >
                <AiOutlineRight size={20} color="black" />
              </div>
              <span className="contentText ms-1 fs-6 fw-bolder text-uppercase ">
                Make an Appointment
              </span>
            </div>
          </button>
        </Col>

        {/* Right Column */}
        <Col
          md={6}
          className={`d-flex justify-content-center align-items-center position-relative ${
            animate ? "slide-in-right" : ""
          }`}
        >
          <img
            src={require("../images/backgroundPerson.png")}
            alt="Background Person"
            className="img-fluid "
          />
        </Col>
      </Row>

      {/* Scroll More Button, below the image, aligned to the right */}
      <Row>
        <Col className="d-flex mb-4 justify-content-end mt-4 slide-in-right-two">
          <button
            className="scroll-more-btn px-2 animate-button"
            onClick={handleScrollMoreClick}
          >
            <MdArrowDownward size={20} color="white" className="bold-icon" />
            <span className="ms-2 mx-1 text-white fw-bold text-uppercase">
              Scroll for More
            </span>
          </button>
        </Col>
      </Row>

      <Row className="position-relative mt-5">
        <Col className="videoAnimation">
          {/* Container for video and text */}
          <div className="video-container position-relative">
            <video
              width="100%"
              height="auto"
              autoPlay
              loop
              muted
              className={`rounded-5 ${videoInView ? "animate-video" : ""}`}
            >
              <source src={Video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Overlay Text */}
            <div
              className={`text-start video-overlay-text px-5 videoAnimation position-absolute top-50 start-0 translate-middle-y text-white ${
                videoInView ? "fade-in-text" : ""
              }`}
              style={{ width: "50%" }}
            >
              <h2 className="text-uppercase pb-5">
                Ireland’s Premier Surgical Center, Committed to Your Well-being
              </h2>
              <h2 className="mr-4">
                With a Team of Renowned Surgeons Delivering Life-Changing
                Results
              </h2>
            </div>
          </div>
        </Col>
      </Row>

      {/* Display First 3 Doctors */}
      <div className="text-center my-5 doctors-section">
        <h2>Our Renowned Doctors</h2>
        <Row className="mt-4">
          {filteredDoctors.map((doctor, index) => (
            <Col key={index} md={4} className="mb-4">
              <div
                className={`doctor-box ${
                  doctorsInView ? "animate-button" : ""
                }`}
              >
                <Card className="shadow-lg" style={{ borderRadius: "15px" }}>
                  <Card.Img
                    variant="top"
                    src={doctorImage} // Using the imported image for all doctors
                    alt={`${doctor.first_name} ${doctor.last_name}`}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px",
                    }}
                  />
                  <Card.Body>
                    <Card.Title>{`${doctor.first_name} ${doctor.last_name}`}</Card.Title>
                    <Card.Text>{doctor.specialisation}</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default Home;
