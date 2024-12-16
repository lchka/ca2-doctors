import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
import "../../styles/Animation.scss"; // Import the SCSS file for smooth animations

const SinglePatient = () => {
  const { token } = useAuth();
  const [patient, setPatient] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

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

  const formatDate = (timestamp) => {
    if (typeof timestamp !== "number") {
      console.error("Invalid timestamp:", timestamp);
      return "Invalid Date";
    }

    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

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
      setDiagnoses(diagnoses.filter((diagnosis) => diagnosis.id !== diagnosisId));
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
        prescriptions.filter((prescription) => prescription.id !== prescriptionId)
      );
    } catch (error) {
      console.error("Error deleting prescription:", error);
      setError("Error deleting prescription");
    }
  };

  if (!patient) {
    return "Loading...";
  }

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {/* Left Section (Patient Info + Image) */}
        <Col md={6}>
          <div className="d-flex flex-column border p-3 rounded">
            <div className="d-flex justify-content-between">
              <h1 className="fs-1 mb-5">
                {patient.first_name} {patient.last_name}
              </h1>
              {/* Patient Image Placeholder */}
            </div>
            <div className="d-flex">
              {/* Patient Details */}
              <div className="w-75">
                <p className="fs-5"><strong>Email:</strong> {patient.email}</p>
                <p className="fs-5">Phone: {patient.phone}</p>
                <p className="fs-5">Date of Birth: {formatDate(patient.date_of_birth)}</p>
                <p className="fs-5" >Address: {patient.address}</p>
              </div>
              {/* Patient Image */}
              <div className="w-25">
                <Image src="https://via.placeholder.com/150" fluid />
              </div>
            </div>
            {/* Edit Patient Button */}
            <Button
              variant="primary"
              onClick={() => navigate(`/patients/${id}/edit`)}
            >
              Edit Patient
            </Button>
          </div>
        </Col>

        {/* Right Section (Conditions) */}
        <Col md={6}>
          <div
            className="border p-3 rounded"
            style={{ borderColor: "lightblue" }}
          >
            <h5>Conditions</h5>
            <div className="mt-3">
              <Button
                variant="secondary"
                onClick={() => navigate(`/diagnoses/add/${id}`)}
              >
                Add Diagnosis
              </Button>
            </div>
            {diagnoses && diagnoses.length > 0 ? (
              diagnoses.map((d) => {
                const diagnosisPrescriptions = prescriptions.filter(
                  (prescription) => prescription.diagnosis_id === d.id
                );
                return (
                  <div
                    key={d.id}
                    className="mb-3"
                    style={{ borderColor: "lightgreen" }}
                  >
                    <div className="border p-3 rounded">
                      <h6>Condition: {d.condition}</h6>
                      <p>Diagnosis Date: {formatDate(d.diagnosis_date)}</p>
                      <div>
                        {/* Buttons for Add/Edit Prescription */}
                        <Button
                          variant="secondary"
                          onClick={() =>
                            navigate(`/prescriptions/create/${id}/${d.id}`)

                          }
                        >
                          Add Prescription
                        </Button>
                        <Button
                          variant="warning"
                          onClick={() =>
                            navigate(`/diagnoses/edit/${id}/${d.id}`)
                          }
                        >
                          Edit Diagnosis
                        </Button>
                        {/* Delete Diagnosis Button */}
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteDiagnosis(d.id)}
                          className="ms-2"
                        >
                          Delete Diagnosis
                        </Button>
                      </div>

                      {/* Prescriptions and Edit Prescription Button */}
                      {diagnosisPrescriptions.length > 0 ? (
                        <div>
                          <h6>Prescriptions</h6>
                          {diagnosisPrescriptions.map((prescription) => (
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
                                    <strong>Dosage:</strong>{" "}
                                    {prescription.dosage}
                                  </p>
                                  <p>
                                    <strong>Doctor:</strong>{" "}
                                    {doctors[prescription.doctor_id] ||
                                      "Unknown"}
                                  </p>
                                  <p>
                                    <strong>Prescription Period:</strong>{" "}
                                    {formatDate(prescription.start_date)} to{" "}
                                    {formatDate(prescription.end_date)}
                                  </p>
                                  <Button
                                    variant="danger"
                                    onClick={() =>
                                      handleDeletePrescription(prescription.id)
                                    }
                                  >
                                    Delete Prescription
                                  </Button>
                                </div>
                              </Collapse>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No prescriptions for this diagnosis.</p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No diagnoses available.</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SinglePatient;
