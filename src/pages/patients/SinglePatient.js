import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Alert,
  Button,
  Image,
  Collapse,
} from "react-bootstrap";
import { useAuth } from "../../utils/useAuth";
import "../../styles/Patients.scss"; // Import the SCSS file for smooth animations
import patientImage from "../../images/patient.png"; // Importing the image

const SinglePatient = () => {
  const { token } = useAuth();
  const [patient, setPatient] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [expandedPrescriptions, setExpandedPrescriptions] = useState({});

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientResponse = await axios.get(
          `https://fed-medical-clinic-api.vercel.app/patients/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPatient(patientResponse.data);

        const diagnosisResponse = await axios.get(
          `https://fed-medical-clinic-api.vercel.app/diagnoses?patient_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const diagnosesData = diagnosisResponse.data;
        const filteredDiagnoses = diagnosesData.filter(
          (d) => d.patient_id === parseInt(id)
        );
        setDiagnoses(filteredDiagnoses);

        const prescriptionResponse = await axios.get(
          `https://fed-medical-clinic-api.vercel.app/prescriptions?patient_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPrescriptions(prescriptionResponse.data);

        const doctorIds = prescriptionResponse.data.map(
          (prescription) => prescription.doctor_id
        );
        const uniqueDoctorIds = [...new Set(doctorIds)];

        const doctorRequests = uniqueDoctorIds.map((doctorId) =>
          axios.get(
            `https://fed-medical-clinic-api.vercel.app/doctors/${doctorId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        );

        const doctorResponses = await Promise.all(doctorRequests);
        const doctorData = doctorResponses.reduce((acc, response) => {
          const doctor = response.data;
          acc[doctor.id] = `${doctor.first_name} ${doctor.last_name}`;
          return acc;
        }, {});
        setDoctors(doctorData);
      } catch (error) {
        console.error("Error fetching patient data or diagnoses:", error);
        setError("Error fetching patient data or diagnoses");
      }
    };

    fetchPatientData();
  }, [id, token]);

  const handlePrescriptionToggle = (prescriptionId) => {
    setExpandedPrescriptions((prevState) => ({
      ...prevState,
      [prescriptionId]: !prevState[prescriptionId],
    }));
  };

  const handleDeleteDiagnosis = async (diagnosisId) => {
    try {
      await axios.delete(
        `https://fed-medical-clinic-api.vercel.app/diagnoses/${diagnosisId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDiagnoses(
        diagnoses.filter((diagnosis) => diagnosis.id !== diagnosisId)
      );
    } catch (error) {
      console.error("Error deleting diagnosis:", error);
      setError("Error deleting diagnosis");
    }
  };

  const handleDeletePrescription = async (prescriptionId) => {
    try {
      await axios.delete(
        `https://fed-medical-clinic-api.vercel.app/prescriptions/${prescriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPrescriptions(
        prescriptions.filter(
          (prescription) => prescription.id !== prescriptionId
        )
      );
    } catch (error) {
      console.error("Error deleting prescription:", error);
      setError("Error deleting prescription");
    }
  };

  const handleDeletePatient = async () => {
    try {
      await axios.delete(
        `https://fed-medical-clinic-api.vercel.app/patients/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/patients', { state: { success: 'Patient successfully deleted!' } }); // Redirect to patients list after deletion with success message
    } catch (error) {
      console.error("Error deleting patient:", error);
      if (error.response && error.response.status === 409) {
        setError("Cannot delete patient. There are related records that must be deleted first.");
      } else {
        setError("Error deleting patient");
      }
    }
  };

  if (!patient) {
    return "Loading...";
  }

  return (
    <Container className="mt-4">
      {state && state.success && (
        <Alert variant="info">
          {state.success}
        </Alert>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {/* Left Section (Patient Info + Image) */}
        <Col md={6}>
          <div className="patient-info d-flex flex-column border p-3 rounded-5 shadow-sm animate-left hover-animate">
            <div className="d-flex justify-content-between">
              <h1 className="fs-1 mb-5">
                {patient.first_name} {patient.last_name}
              </h1>
              {/* Patient Image Placeholder */}
            </div>
            <div className="d-flex">
              {/* Patient Details */}
              <div className="w-75">
                <p className="fs-5">
                  <strong>Email:</strong> {patient.email}
                </p>
                <p className="fs-5">
                  <strong>Phone:</strong> {patient.phone}
                </p>
                <p className="fs-5">
                  <strong>Date of Birth: </strong>
                  {patient.date_of_birth}
                </p>
                <p className="fs-5"><strong>Address:</strong> {patient.address}</p>
              </div>
              {/* Patient Image */}
              <div className="w-25">
                <Image src={patientImage} fluid />
              </div>
            </div>
            {/* Edit Patient Button */}
            <Button
            className="btn-view-details my-2 rounded-3 text-uppercase fw-semibold"
              variant="primary"
              onClick={() => navigate(`/patients/${id}/edit`)}
            >
              Edit Patient
            </Button>
            <Button className="btn-delete my-2 text-uppercase fw-semibold rounded-3" onClick={handleDeletePatient}>Delete Patient</Button>

          </div>
        </Col>

        {/* Right Section (Conditions) */}
        <Col md={6}>
          <div className="conditions-section p-3 rounded-3 animate-right">
            <h3 className="mb-3">Conditions</h3>
            {diagnoses.length > 0 ? (
              diagnoses.map((diagnosis) => (
                <div key={diagnosis.id} className="mb-3">
                  <h5>{diagnosis.condition}</h5>
                  <p>
                    <strong>Date:</strong> {diagnosis.date}
                  </p>
                  <p>
                    <strong>Notes:</strong> {diagnosis.notes}
                  </p>
                  <div>
                    {/* Buttons for Add/Edit Prescription */}
                    <Button
                      variant="secondary"
                      onClick={() =>
                        navigate(
                          `/prescriptions/create?patient_id=${id}&diagnosis_id=${diagnosis.id}`
                        )
                      }
                    >
                      Add Prescription
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() =>
                        navigate(
                          `/diagnoses/${diagnosis.id}/edit?patient_id=${id}`
                        )
                      }
                    >
                      Edit Diagnosis
                    </Button>
                    {/* Delete Diagnosis Button */}
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteDiagnosis(diagnosis.id)}
                      className="ms-2"
                    >
                      Delete Diagnosis
                    </Button>
                  </div>

                  {/* Prescriptions and Edit Prescription Button */}
                  {prescriptions.filter(
                    (prescription) => prescription.diagnosis_id === diagnosis.id
                  ).length > 0 ? (
                    <div>
                      <h6>Prescriptions</h6>
                      {prescriptions
                        .filter(
                          (prescription) =>
                            prescription.diagnosis_id === diagnosis.id
                        )
                        .map((prescription) => (
                          <div key={prescription.id}>
                            <p>
                              <strong>Medication:</strong>{" "}
                              {prescription.medication}
                            </p>
                            <Button
                              variant="link"
                              onClick={() =>
                                handlePrescriptionToggle(prescription.id)
                              }
                            >
                              {expandedPrescriptions[prescription.id]
                                ? "View Less"
                                : "View more"}
                            </Button>
                            <Collapse
                              in={expandedPrescriptions[prescription.id]}
                            >
                              <div>
                                <p>
                                  <strong>Dosage:</strong> {prescription.dosage}
                                </p>
                                <p>
                                  <strong>Doctor:</strong>{" "}
                                  {doctors[prescription.doctor_id] || "Unknown"}
                                </p>
                                <p>
                                  <strong>Prescription Period:</strong>{" "}
                                  {prescription.start_date} to{" "}
                                  {prescription.end_date}
                                </p>
                                <div>
                                  {/* Edit Prescription Button */}
                                  <Button
                                    variant="warning"
                                    onClick={() =>
                                      navigate(
                                        `/prescriptions/${prescription.id}/edit`
                                      )
                                    }
                                  >
                                    Edit Prescription
                                  </Button>
                                  {/* Delete Prescription Button */}
                                  <Button
                                    variant="danger"
                                    onClick={() =>
                                      handleDeletePrescription(prescription.id)
                                    }
                                    className="ms-2"
                                  >
                                    Delete Prescription
                                  </Button>
                                </div>
                              </div>
                            </Collapse>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p>No prescriptions for this diagnosis.</p>
                  )}
                </div>
              ))
            ) : (
              <p>No conditions found.</p>
            )}

            {/* View More Diagnoses Button */}
            {diagnoses.length > 2 && (
              <Button
                variant="primary"
                onClick={() => navigate(`/patients/${id}/diagnoses`)}
              >
                View More Diagnoses
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SinglePatient;