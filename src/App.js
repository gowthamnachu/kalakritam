import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IntroVideo from './components/IntroVideo/IntroVideo';
import Home from './components/Home/Home';
import AdminLogin from './components/AdminLogin/AdminLogin';
import AdminHomePage from './components/AdminHomePage/AdminHomePage';
import AdminArts from './components/AdminArts/AdminArts';
import AdminUploads from './components/AdminUploads/AdminUploads';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import DashboardHeader from './components/DashboardHeader/DashboardHeader';
import Arts from './components/Arts/Arts';
import Events from './components/Events/Events';
import AboutUs from './components/AboutUs/AboutUs';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<IntroVideo />} />
          <Route path="*" element={
            <>
              <DashboardHeader />
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/arts" element={<Arts />} />
                <Route path="/events" element={<Events />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin-home" element={<ProtectedRoute><AdminHomePage /></ProtectedRoute>} />
                <Route path="/admin-arts" element={<ProtectedRoute><AdminArts /></ProtectedRoute>} />
                <Route path="/admin-uploads" element={<ProtectedRoute><AdminUploads /></ProtectedRoute>} />
              </Routes>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
