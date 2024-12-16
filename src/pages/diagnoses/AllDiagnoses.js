import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../utils/useAuth";

const AllDiagnoses = () => {
  const { token } = useAuth();
  const { id } = useParams(); // id is the patient ID from the URL
  const [diagnosis, setDiagnosis] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        // Fetch diagnoses for the specific patient
        const diagnosisResponse = await axios.get(
          `https://fed-medical-clinic-api.vercel.app/diagnoses?patient_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const diagnosesData = diagnosisResponse.data;

        // Filter diagnoses to ensure they match the patient_id from the URL
        const filteredDiagnoses = diagnosesData.filter((d) => d.patient_id === parseInt(id));

        // Fetch prescriptions for each diagnosis
        const prescriptions = await Promise.all(
          filteredDiagnoses.map(async (d) => {
            try {
              const prescriptionResponse = await axios.get(
                `https://fed-medical-clinic-api.vercel.app/prescriptions?diagnosis_id=${d.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              // Filter prescriptions to ensure they match the patient_id
              const prescriptionData = prescriptionResponse.data.filter(
                (p) => p.patient_id === parseInt(id)
              );

              return { ...d, prescription: prescriptionData[0] || null };
            } catch (err) {
              console.error(`Error fetching prescription for diagnosis ${d.id}:`, err);
              return { ...d, prescription: null };
            }
          })
        );

        setDiagnosis(prescriptions);
      } catch (error) {
        console.error("Error fetching diagnoses or prescriptions:", error);
        setError("Error fetching diagnoses or prescriptions");
      }
    };

    fetchDiagnoses();
  }, [id, token]);

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={12}>
          <h1>All Diagnoses</h1>
          {diagnosis.length > 0 ? (
            diagnosis.map((d) => (
              <Card className="mb-3" key={d.id}>
                <Card.Body>
                  <Card.Title>Condition: {d.condition}</Card.Title>
                  <Card.Text>Diagnosis Date: {d.diagnosis_date}</Card.Text>
                  {d.prescription ? (
                    <>
                      <Card.Text>Medication: {d.prescription.medication}</Card.Text>
                      <Card.Text>Dosage: {d.prescription.dosage}</Card.Text>
                      <Card.Text>Doctor ID: {d.prescription.doctor_id}</Card.Text>
                      <Card.Text>
                        Prescription Period: {d.prescription.start_date} to {d.prescription.end_date}
                      </Card.Text>
                    </>
                  ) : (
                    <Card.Text>No prescription available</Card.Text>
                  )}
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/diagnoses/${d.id}/edit`)}
                  >
                    Edit Diagnosis
                  </Button>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No diagnoses found.</p>
          )}
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => navigate(`/diagnoses/create?patient_id=${id}`)}
          >
            Add Diagnosis
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default AllDiagnoses;
