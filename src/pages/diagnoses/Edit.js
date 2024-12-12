import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../utils/useAuth';

const Edit = () => {
    const [form, setForm] = useState({
        patient_id: '',
        condition: '',
        diagnosis_date: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();

    useEffect(() => {
        const fetchDiagnosis = async () => {
            try {
                const response = await axios.get(`https://fed-medical-clinic-api.vercel.app/diagnoses/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setForm(response.data);
            } catch (error) {
                console.error('Error fetching diagnosis:', error);
                setError('Error fetching diagnosis');
            }
        };

        fetchDiagnosis();
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
            await axios.put(`https://fed-medical-clinic-api.vercel.app/diagnoses/${id}`, form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate(`/diagnoses/${id}`); // Navigate to the diagnosis details page after successful update
        } catch (error) {
            console.error('Error updating diagnosis:', error);
            setError('Error updating diagnosis');
        }
    };

    return (
        <Container className="mt-4">
            <h1>Edit Diagnosis</h1>
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
                    Update
                </Button>
            </Form>
        </Container>
    );
};

export default Edit;