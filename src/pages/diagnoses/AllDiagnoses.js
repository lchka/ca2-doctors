import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert, Collapse, Pagination } from "react-bootstrap";
import { useAuth } from "../../utils/useAuth";
import "../../styles/Patients.scss"; // Import the SCSS file for consistent styling

const AllDiagnoses = () => {
  const { token } = useAuth();
  const { id } = useParams(); // id is the patient ID from the URL
  const [patient, setPatient] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [error, setError] = useState(null);
  const [expandedPrescriptions, setExpandedPrescriptions] = useState({}); // For toggling prescription details
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const diagnosesPerPage = 4; // Number of diagnoses per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientAndDiagnoses = async () => {
      try {
        // Fetch patient details
        const patientResponse = await axios.get(
          `https://fed-medical-clinic-api.vercel.app/patients/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPatient(patientResponse.data);

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
        const diagnosesWithPrescriptions = await Promise.all(
          filteredDiagnoses.map(async (d) => {
            try {
              const prescriptionResponse = await axios.get(
                `https://fed-medical-clinic-api.vercel.app/prescriptions?diagnosis_id=${d.id}&patient_id=${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              // Filter prescriptions to ensure they match both the patient_id and diagnosis_id
              const prescriptionData = prescriptionResponse.data.filter(
                (p) => p.patient_id === parseInt(id) && p.diagnosis_id === d.id
              );

              return { ...d, prescriptions: prescriptionData };
            } catch (err) {
              console.error(`Error fetching prescription for diagnosis ${d.id}:`, err);
              return { ...d, prescriptions: [] };
            }
          })
        );

        setDiagnoses(diagnosesWithPrescriptions);
      } catch (error) {
        console.error("Error fetching patient details, diagnoses, or prescriptions:", error);
        setError("Error fetching patient details, diagnoses, or prescriptions");
      }
    };

    fetchPatientAndDiagnoses();
  }, [id, token]);

  const handlePrescriptionToggle = (prescriptionId) => {
    // Toggle the visibility of prescription details
    setExpandedPrescriptions((prevState) => ({
      ...prevState,
      [prescriptionId]: !prevState[prescriptionId],
    }));
  };

  const handleDeleteDiagnosis = async (diagnosisId) => {
    try {
      // Delete the diagnosis from the database
      await axios.delete(
        `https://fed-medical-clinic-api.vercel.app/diagnoses/${diagnosisId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(`/patients/${id}`, { state: { success: 'Diagnosis deleted successfully.' } });
    } catch (error) {
      console.error("Error deleting diagnosis:", error);
      setError("Error deleting diagnosis");
    }
  };

  const handleDeletePrescription = async (prescriptionId) => {
    try {
      // Delete the prescription from the database
      await axios.delete(
        `https://fed-medical-clinic-api.vercel.app/prescriptions/${prescriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDiagnoses((prevDiagnoses) =>
        prevDiagnoses.map((diagnosis) => ({
          ...diagnosis,
          prescriptions: diagnosis.prescriptions.filter(
            (prescription) => prescription.id !== prescriptionId
          ),
        }))
      );
    } catch (error) {
      console.error("Error deleting prescription:", error);
      setError("Error deleting prescription");
    }
  };

  // Pagination logic
  const indexOfLastDiagnosis = currentPage * diagnosesPerPage;
  const indexOfFirstDiagnosis = indexOfLastDiagnosis - diagnosesPerPage;
  const currentDiagnoses = diagnoses.slice(indexOfFirstDiagnosis, indexOfLastDiagnosis);

  const paginate = (pageNumber) => setCurrentPage(pageNumber); // Update the current page

  const formatDate = (dateString) => {
    // Format the date string to a more readable format
    if (typeof dateString !== 'string') {
      dateString = dateString.toString();
    }
    const day = dateString.slice(0, 2);
    const month = dateString.slice(2, 4) - 1; // Months are zero-indexed in JavaScript
    const year = '20' + dateString.slice(4, 6); // Assuming the year is in the 2000s
    const date = new Date(year, month, day);
    return date.toLocaleDateString();
  };

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>} {/* Display error if any */}
      <Row>
        <Col md={12}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1>All Diagnoses for {patient ? patient.first_name : 'Loading...'}</h1>
            <Button
              className="editD text-uppercase fw-semibold"
              onClick={() => navigate(`/diagnoses/create?patient_id=${id}`)}
            >
              Add Diagnosis
            </Button>
          </div>
          {currentDiagnoses.length > 0 ? (
            currentDiagnoses.map((d) => (
              <Card key={d.id} className="mb-3 rounded-3 shadow-sm editD-card">
                <Card.Body>
                  <h3 className="fw-bold">{d.condition}</h3>
                  <p>
                    <strong>Date:</strong> {formatDate(d.diagnosis_date)}
                  </p>
                  <div className="prescription-buttons">
                    <Button
                      className="addP text-uppercase fw-semibold"
                      variant="secondary"
                      onClick={() =>
                        navigate(
                          `/prescriptions/create?patient_id=${id}&diagnosis_id=${d.id}`
                        )
                      }
                    >
                      Add Prescription
                    </Button>
                    <Button
                      className="editD text-uppercase fw-semibold"
                      onClick={() =>
                        navigate(
                          `/diagnoses/${d.id}/edit?patient_id=${id}`
                        )
                      }
                    >
                      Edit Diagnosis
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteDiagnosis(d.id)}
                      className="ms-2 text-uppercase fw-semibold"
                    >
                      Delete Diagnosis
                    </Button>
                  </div>

                  {d.prescriptions.length > 0 ? (
                    <div className="prescription-box">
                      <h4 className="text-uppercase fw-semibold">Prescriptions</h4>
                      {d.prescriptions.map((prescription) => (
                        <div key={prescription.id}>
                          <p>
                            <strong>Medication:</strong> {prescription.medication}
                          </p>
                          <Collapse in={expandedPrescriptions[prescription.id]}>
                            <div>
                              <p>
                                <strong>Dosage:</strong> {prescription.dosage}
                              </p>
                              <p>
                                <strong>Doctor:</strong> {prescription.doctor_id}
                              </p>
                              <p>
                                <strong>Prescription Period:</strong> {prescription.start_date} to {prescription.end_date}
                              </p>
                              <div>
                                <Button
                                  className="addP text-uppercase fw-semibold"
                                  variant="warning"
                                  onClick={() =>
                                    navigate(`/prescriptions/${prescription.id}/edit`)
                                  }
                                >
                                  Edit Prescription
                                </Button>
                                <Button
                                  variant="danger"
                                  onClick={() => handleDeletePrescription(prescription.id)}
                                  className="ms-2 text-uppercase fw-semibold"
                                >
                                  Delete Prescription
                                </Button>
                              </div>
                            </div>
                          </Collapse>
                          <Button
                            className="view-more-less text-center fw-6 text-uppercase fw-semibold"
                            variant="link"
                            onClick={() => handlePrescriptionToggle(prescription.id)}
                          >
                            {expandedPrescriptions[prescription.id]
                              ? "View Less"
                              : "View More"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No prescriptions for this diagnosis.</p>
                  )}
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No diagnoses found.</p>
          )}
          {diagnoses.length > diagnosesPerPage && (
            <Pagination className="mt-3 justify-content-center">
              {[...Array(Math.ceil(diagnoses.length / diagnosesPerPage)).keys()].map(number => (
                <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                  {number + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AllDiagnoses;