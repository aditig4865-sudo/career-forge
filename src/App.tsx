import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Templates } from './pages/Templates';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { CareerGuidance } from './pages/CareerGuidance';
import { MyResumes } from './pages/MyResumes';
import { AdminDashboard } from './pages/AdminDashboard';

import { ResumeProvider } from './context/ResumeContext';

import { Footer } from './components/layout/Footer';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ResumeProvider>
      <Router>
        <ScrollToTop />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/career-guidance" element={<CareerGuidance />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/my-resumes" element={<MyResumes />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ResumeProvider>
  );
}

export default App;
