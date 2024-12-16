import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Button from "../components/Button"; // Import the OrderNowButton component
import "../styles/Home.scss"; // Import the custom CSS file for styles

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const msg = useLocation()?.state?.msg || null;

  useEffect(() => {
    const fetchWeather = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Step 1: Get the location key based on the user's coordinates
            const locationRes = await axios.get(
              `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=paHt0NkAJFvoak40KyRHvAPNIjpPP4KE&q=${latitude},${longitude}`
            );
            const locationKey = locationRes.data.Key;

            // Step 2: Get the current weather for the location using the location key
            const weatherRes = await axios.get(
              `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=paHt0NkAJFvoak40KyRHvAPNIjpPP4KE`
            );
            setWeather(weatherRes.data[0]); // Set the weather data
            setLoading(false); // Set loading to false when done
          } catch (error) {
            setError("Failed to fetch weather data.");
            setLoading(false); // Set loading to false in case of error
          }
        });
      } else {
        setError("Geolocation is not supported by this browser.");
        setLoading(false); // Set loading to false if geolocation is not supported
      }
    };

    fetchWeather();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <Container className="home-container mt-4">
      {msg && <Alert variant="info">{msg}</Alert>}
      <Row className="justify-content-center">
        <Col md={4} className="text-left mt-5">
          <h1 className="display-4 gradient-text font-weight-bold">
            Dun Laoghaire Medical Center & Services
          </h1>
          <p className="lead">Providing quality healthcare services to the community.</p>

          {/* Order Now Button */}
          <Button />

          {/* Display Weather Info */}
          {loading && <Spinner animation="border" />}
          {error && <Alert variant="danger">{error}</Alert>}
          {weather && (
            <div>
              <h4>Weather: {weather.WeatherText}</h4>
              <p>
                Temperature: {weather.Temperature.Metric.Value}°{weather.Temperature.Metric.Unit}
              </p>
            </div>
          )}
        </Col>
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <img
            src={require("../images/backgroundPerson.png")} // Import the image
            alt="Background Person"
            className="img-fluid" // Make sure it scales properly
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
