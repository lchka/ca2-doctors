import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';

const Edit = () => {
    const [form, setForm] = useState({
        patient_id: '',
        doctor_id: '',
        diagnosis_id: '',
        medication: '',
        dosage: '',
        start_date: '',
        end_date: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();

    useEffect(() => {
        const fetchPrescription = async () => {
            try {
                const response = await axios.get(`https://fed-medical-clinic-api.vercel.app/prescriptions/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setForm(response.data);
            } catch (error) {
                console.error('Error fetching prescription:', error);
                setError('Error fetching prescription');
            }
        };

        fetchPrescription();
    }, [id, token]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://fed-medical-clinic-api.vercel.app/prescriptions/${id}`, form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate(`/prescriptions/${id}`); // Navigate to the prescription details page after successful update
        } catch (error) {
            console.error('Error updating prescription:', error);
            setError('Error updating prescription');
        }
    };

    return (
        <Container className="mt-4">
            <h1>Edit Prescription</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formPatientId">
                    <Form.Label>Patient ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter patient ID"
                        name="patient_id"
                        value={form.patient_id}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formDoctorId">
                    <Form.Label>Doctor ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter doctor ID"
                        name="doctor_id"
                        value={form.doctor_id}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formDiagnosisId">
                    <Form.Label>Diagnosis ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter diagnosis ID"
                        name="diagnosis_id"
                        value={form.diagnosis_id}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formMedication">
                    <Form.Label>Medication</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter medication"
                        name="medication"
                        value={form.medication}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formDosage">
                    <Form.Label>Dosage</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter dosage"
                        name="dosage"
                        value={form.dosage}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formStartDate">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter start date"
                        name="start_date"
                        value={form.start_date}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formEndDate">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter end date"
                        name="end_date"
                        value={form.end_date}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Update
                </Button>
            </Form>
        </Container>
    );
};

export default Edit;