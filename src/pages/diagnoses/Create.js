import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';

const Create = () => {
    const [form, setForm] = useState({
        patient_id: '',
        condition: '',
        diagnosis_date: ''
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
            await axios.post('https://fed-medical-clinic-api.vercel.app/diagnoses', form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/diagnoses'); // Navigate to the diagnoses list page after successful creation
        } catch (error) {
            console.error('Error creating diagnosis:', error);
            setError('Error creating diagnosis');
        }
    };

    return (
        <Container className="mt-4">
            <h1>Create Diagnosis</h1>
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

                <Form.Group controlId="formCondition">
                    <Form.Label>Condition</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter condition"
                        name="condition"
                        value={form.condition}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formDiagnosisDate">
                    <Form.Label>Diagnosis Date</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter diagnosis date"
                        name="diagnosis_date"
                        value={form.diagnosis_date}
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