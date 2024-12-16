import { createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from 'react-bootstrap';
import { AuthProvider } from './utils/useAuth'; // Importing AuthProvider

import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from './components/Navbar';
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import SingleDoctor from "./pages/doctors/SingleDoctor";
import CreateDoctor from './pages/doctors/Create';
import EditDoctor from './pages/doctors/Edit';
import Doctors from './pages/doctors/Doctors';
import Patients from './pages/patients/Patients';
import CreatePatient from './pages/patients/Create';
import EditPatient from './pages/patients/Edit';
import SinglePatient from './pages/patients/SinglePatient';
import Prescriptions from './pages/prescriptions/Prescriptions'; // Updated Prescription list component
import SinglePrescription from './pages/prescriptions/SinglePrescription'; // Importing the SinglePrescription component
import EditPrescription from './pages/prescriptions/Edit'; // Importing the EditPrescription component
import CreatePrescription from './pages/prescriptions/Create'; // Importing the CreatePrescription component
import Diagnoses from './pages/diagnoses/Diagnoses'; // Importing the Diagnoses component
import SingleDiagnose from './pages/diagnoses/SingleDiagnose'; // Importing the SingleDiagnose component
import EditDiagnose from './pages/diagnoses/Edit'; // Importing the EditDiagnose component
import CreateDiagnose from './pages/diagnoses/Create'; // Importing the CreateDiagnose component
import Appointments from './pages/appointments/Appointments'; // Importing the Appointments component
import SingleAppointment from './pages/appointments/SingleAppointment'; // Importing the SingleAppointment component
import EditAppointment from './pages/appointments/Edit'; // Importing the EditAppointment component
import CreateAppointment from './pages/appointments/Create'; // Importing the CreateAppointment component
import AllDiagnoses from "./pages/diagnoses/AllDiagnoses"; // Import the new page

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
                            <Route path="/prescriptions" element={<Prescriptions />} /> {/* Updated */}
                            <Route path="/prescriptions/create" element={<CreatePrescription />} /> {/* Adding the route for creating a prescription */}
                            <Route path="/prescriptions/:id" element={<SinglePrescription />} /> {/* Adding the route for viewing a single prescription */}
                            <Route path="/prescriptions/:id/edit" element={<EditPrescription />} /> {/* Adding the route for editing a prescription */}
                            {/* Diagnosis routes */}
                            <Route path="/patients/:id/diagnoses" element={<AllDiagnoses />} />
                            <Route path="/diagnoses" element={<Diagnoses />} /> {/* Adding the route for viewing diagnoses */}
                            <Route path="/diagnoses/create" element={<CreateDiagnose />} /> {/* Adding the route for creating a diagnosis */}
                            <Route path="/diagnoses/:id" element={<SingleDiagnose />} /> {/* Adding the route for viewing a single diagnosis */}
                            <Route path="/diagnoses/:id/edit" element={<EditDiagnose />} /> {/* Adding the route for editing a diagnosis */}
                            {/* Appointment routes */}
                            <Route path="/appointments" element={<Appointments />} /> {/* Adding the route for viewing appointments */}
                            <Route path="/appointments/create" element={<CreateAppointment />} /> {/* Adding the route for creating an appointment */}
                            <Route path="/appointments/:id" element={<SingleAppointment />} /> {/* Adding the route for viewing a single appointment */}
                            <Route path="/appointments/:id/edit" element={<EditAppointment />} /> {/* Adding the route for editing an appointment */}
                            {/* Authentication routes */}
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/register" element={<RegisterForm />} />
                            <Route path="/protected" element={<ProtectedRoute />} />
                        </Routes>
                    </Container>
                </Router>
            </AuthProvider>
        </div>
    );
}

export default App;