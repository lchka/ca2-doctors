import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { useAuth } from "../../utils/useAuth";



//not used



const SinglePatient = () => {
    const { token } = useAuth();  // Retrieve the authentication token
    const [patient, setPatient] = useState(null);  // State to store patient data
    const [diagnosis, setDiagnosis] = useState(null);  // State to store diagnosis data
    const [prescription, setPrescription] = useState(null);  // State to store prescription data
    const [doctor, setDoctor] = useState(null);  // State to store doctor data
    const [error, setError] = useState(null);  // State to store any error messages
    const { id } = useParams();  // Retrieve the patient ID from the URL parameters
    const navigate = useNavigate();  // Hook to navigate programmatically

    useEffect(() => {
        // Fetch data for the patient, diagnosis, prescription, and doctor
        const fetchPatientData = async () => {
            try {
                // Fetch patient details
                const patientResponse = await axios.get(`https://fed-medical-clinic-api.vercel.app/patients/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPatient(patientResponse.data);  // Set patient data

                // Fetch diagnosis details for the patient
                const diagnosisResponse = await axios.get(`https://fed-medical-clinic-api.vercel.app/diagnoses?patient_id=${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDiagnosis(diagnosisResponse.data[0]);  // Set diagnosis data (first entry)

                // Fetch prescription details for the patient
                const prescriptionResponse = await axios.get(`https://fed-medical-clinic-api.vercel.app/prescriptions?patient_id=${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPrescription(prescriptionResponse.data[0]);  // Set prescription data (first entry)

                if (prescriptionResponse.data[0]) {
                    // Fetch doctor details if prescription exists
                    const doctorResponse = await axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/${prescriptionResponse.data[0].doctor_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setDoctor(doctorResponse.data);  // Set doctor data
                }
            } catch (error) {
                console.error('Error fetching patient data:', error);
                setError('Error fetching patient data');  // Set error message if fetching fails
            }
        };

        fetchPatientData();  // Call function to fetch data
    }, [id, token]);  // Re-fetch data if patient ID or token changes

    if (!patient) {
        return 'Loading...';  // Show loading message if patient data is not yet available
    }

    return (
        <Container className="mt-4">
            {error && <Alert variant="danger">{error}</Alert>}  {/* Display error alert if any */}
            <Row>
                <Col md={12}>
                    <div>
                        <Link to={`/patients/${id}/edit`}>Edit patient</Link>  {/* Link to edit patient details */}
                        <h1>{patient.first_name} {patient.last_name}</h1>
                        <p>Email: {patient.email}</p>
                        <p>Phone: {patient.phone}</p>
                        <p>Date of Birth: {patient.date_of_birth}</p>
                        <p>Address: {patient.address}</p>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    {diagnosis && (
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Condition</Card.Title>
                                <Card.Text>Condition: {diagnosis.condition}</Card.Text>
                                <Card.Text>Diagnosis Date: {diagnosis.diagnosis_date}</Card.Text>
                                <Link to={`/patients/${id}/edit-condition`}>Edit Condition</Link>  {/* Link to edit condition */}
                                <br />
                                <Link to={`/patients/${id}/add-condition`}>Add Condition</Link>  {/* Link to add new condition */}
                            </Card.Body>
                        </Card>
                    )}
                    {prescription && (
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Prescription</Card.Title>
                                <Card.Text>Medication: {prescription.medication}</Card.Text>
                                <Card.Text>Dosage: {prescription.dosage}</Card.Text>
                                <Card.Text>Start Date: {prescription.start_date}</Card.Text>
                                <Card.Text>End Date: {prescription.end_date}</Card.Text>
                                <Link to={`/patients/${id}/edit-prescription`}>Edit Prescription</Link>  {/* Link to edit prescription */}
                                <br />
                                <Link to={`/patients/${id}/add-prescription`}>Add Prescription</Link>  {/* Link to add a new prescription */}
                            </Card.Body>
                        </Card>
                    )}
                    {doctor && (
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Doctor</Card.Title>
                                <Card.Text>Doctor: {doctor.first_name} {doctor.last_name}</Card.Text>
                            </Card.Body>
                        </Card>
                    )}

                    {/* Button for navigating to create a new prescription */}
                    <Button variant="primary" className="mb-3" onClick={() => navigate(`/patients/${id}/create-prescription`)}>
                        Create Prescription
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default SinglePatient;
