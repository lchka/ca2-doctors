import { AuthProvider } from "./utils/useAuth";
import { createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from 'react-bootstrap';

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
import SinglePatient from './pages/patients/SinglePatient'; // Importing the SinglePatient component

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
                            <Route path="/patients/create" element={<CreatePatient />}></Route>
                            <Route path="/patients/:id/edit" element={<EditPatient />} /> {/* Correcting the route for editing a patient */}
                            <Route path="/patient/:id" element={<SinglePatient />} /> {/* Correcting the route for viewing a single patient */}
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