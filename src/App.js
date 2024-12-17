import { createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from 'react-bootstrap';
import { AuthProvider } from './utils/useAuth'; // Importing AuthProvider

import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from './components/Navbar';
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer'; // Importing Footer component

import Home from './pages/Home';
import SingleDoctor from "./pages/doctors/SingleDoctor";
import CreateDoctor from './pages/doctors/Create';
import EditDoctor from './pages/doctors/Edit';
import Doctors from './pages/doctors/Doctors';
import Patients from './pages/patients/Patients';
import CreatePatient from './pages/patients/Create';
import EditPatient from './pages/patients/Edit';
import SinglePatient from './pages/patients/SinglePatient';
import Prescriptions from './pages/prescriptions/Prescriptions'; 
import SinglePrescription from './pages/prescriptions/SinglePrescription'; 
import EditPrescription from './pages/prescriptions/Edit'; 
import CreatePrescription from './pages/prescriptions/Create'; 
import Diagnoses from './pages/diagnoses/Diagnoses'; 
import SingleDiagnose from './pages/diagnoses/SingleDiagnose'; 
import EditDiagnose from './pages/diagnoses/Edit'; 
import CreateDiagnose from './pages/diagnoses/Create'; 
import Appointments from './pages/appointments/Appointments'; 
import SingleAppointment from './pages/appointments/SingleAppointment'; 
import EditAppointment from './pages/appointments/Edit'; 
import CreateAppointment from './pages/appointments/Create'; 
import AllDiagnoses from "./pages/diagnoses/AllDiagnoses"; 

export const UserContext = createContext();

const App = () => {
    return (
        <div>
            <AuthProvider>
                <Router>
                    <CustomNavbar />
                    <Container>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            {/* Doctor routes */}
                            <Route path="/doctor/:id" element={<SingleDoctor />} />
                            <Route path="/doctor/create" element={<CreateDoctor />} />
                            <Route path="/doctors/:id/edit" element={<EditDoctor />} />
                            <Route path="/doctors" element={<Doctors />} />
                            {/* Patient routes */}
                            <Route path="/patients" element={<Patients />} />
                            <Route path="/patients/create" element={<CreatePatient />} />
                            <Route path="/patients/:id/edit" element={<EditPatient />} />
                            <Route path="/patient/:id" element={<SinglePatient />} />
                            {/* Prescription routes */}
                            <Route path="/prescriptions" element={<Prescriptions />} /> 
                            <Route path="/prescriptions/create" element={<CreatePrescription />} /> 
                            <Route path="/prescriptions/:id" element={<SinglePrescription />} /> 
                            <Route path="/prescriptions/:id/edit" element={<EditPrescription />} /> 
                            {/* Diagnosis routes */}
                            <Route path="/patients/:id/diagnoses" element={<AllDiagnoses />} />
                            <Route path="/diagnoses" element={<Diagnoses />} /> 
                            <Route path="/diagnoses/create" element={<CreateDiagnose />} /> 
                            <Route path="/diagnoses/:id" element={<SingleDiagnose />} /> 
                            <Route path="/diagnoses/:id/edit" element={<EditDiagnose />} /> 
                            {/* Appointment routes */}
                            <Route path="/appointments" element={<Appointments />} /> 
                            <Route path="/appointments/create" element={<CreateAppointment />} /> 
                            <Route path="/appointments/:id" element={<SingleAppointment />} /> 
                            <Route path="/appointments/:id/edit" element={<EditAppointment />} /> 
                            {/* Authentication routes */}
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/register" element={<RegisterForm />} />
                            <Route path="/protected" element={<ProtectedRoute />} />
                        </Routes>
                    </Container>
                    <Footer /> {/* Add Footer here */}
                </Router>
            </AuthProvider>
        </div>
    );
}

export default App;
