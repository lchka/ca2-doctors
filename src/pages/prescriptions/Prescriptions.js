import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { useAuth } from "../../utils/useAuth";


//not used


const SinglePatient = () => {
    const { token } = useAuth();
    const [patient, setPatient] = useState(null);
    const [diagnosis, setDiagnosis] = useState(null);
    const [prescription, setPrescription] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();  // Hook for programmatic navigation

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const patientResponse = await axios.get(`https://fed-medical-clinic-api.vercel.app/patients/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPatient(patientResponse.data);

                const diagnosisResponse = await axios.get(`https://fed-medical-clinic-api.vercel.app/diagnoses?patient_id=${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDiagnosis(diagnosisResponse.data[0]);

                const prescriptionResponse = await axios.get(`https://fed-medical-clinic-api.vercel.app/prescriptions?patient_id=${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPrescription(prescriptionResponse.data[0]);

                if (prescriptionResponse.data[0]) {
                    const doctorResponse = await axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/${prescriptionResponse.data[0].doctor_id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setDoctor(doctorResponse.data);
                }
            } catch (error) {
                console.error('Error fetching patient data:', error);
                setError('Error fetching patient data');
            }
        };

        fetchPatientData();
    }, [id, token]);

    if (!patient) {
        return 'Loading...';
    }

    return (
        <Container className="mt-4">
            {error && <Alert variant="danger">{error}</Alert>}
            <Row>
                <Col md={12}>
                    <div>
                        <Link to={`/patients/${id}/edit`}>
                            Edit patient
                        </Link>
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
                                <Link to={`/patients/${id}/edit-condition`}>Edit Condition</Link>
                                <br />
                                <Link to={`/patients/${id}/add-condition`}>Add Condition</Link>
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
                                <Link to={`/patients/${id}/edit-prescription`}>Edit Prescription</Link>
                                <br />
                                <Link to={`/patients/${id}/add-prescription`}>Add Prescription</Link>
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

                    {/* Button for creating a new prescription */}
                    <Button variant="primary" className="mb-3" onClick={() => navigate(`/patients/${id}/create-prescription`)}>
                        Create Prescription
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default SinglePatient;
