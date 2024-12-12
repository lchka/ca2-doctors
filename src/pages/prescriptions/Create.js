import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';

const Create = () => {
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
    const { token } = useAuth();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://fed-medical-clinic-api.vercel.app/prescriptions', form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/prescriptions'); // Navigate to the prescriptions list page after successful creation
        } catch (error) {
            console.error('Error creating prescription:', error);
            setError('Error creating prescription');
        }
    };

    return (
        <Container className="mt-4">
            <h1>Create Prescription</h1>
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
                    Create
                </Button>
            </Form>
        </Container>
    );
};

export default Create;