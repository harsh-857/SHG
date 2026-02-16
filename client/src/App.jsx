import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterConsumer from './pages/RegisterConsumer';
import RegisterSHG from './pages/RegisterSHG';
import Services from './pages/Services';
import AdminDashboard from './pages/AdminDashboard';
import SHGDashboard from './pages/SHGDashboard';
import About from './pages/About';
import LoginSelect from './pages/LoginSelect';
import RegisterSelect from './pages/RegisterSelect';

function App() {
    return (
        <Router>
            <Header />
            <div className="container" style={{ marginTop: '20px' }}>
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/login-select" element={<LoginSelect />} />
                        <Route path="/register-select" element={<RegisterSelect />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register-consumer" element={<RegisterConsumer />} />
                        <Route path="/register-shg" element={<RegisterSHG />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/shg-dashboard" element={<SHGDashboard />} />
                    </Routes>
                </main>
            </div>
            <Footer />
        </Router>
    );
}

export default App;
