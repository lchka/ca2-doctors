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
import Create from './pages/doctors/Create';
import Edit from './pages/doctors/Edit';

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
                            <Route path="/doctor/create" element={<Create />} />
                            <Route path="/doctor/edit/:id" element={<Edit />} />
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