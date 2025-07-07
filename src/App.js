import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { MusicProvider } from "./context/MusicContext";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import MusicPlayer from "./components/music/MusicPlayer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/Home";
import MoodSelector from "./pages/MoodSelector";
import Recommendations from "./pages/Recommendations";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./components/user/UserProfile";
import "./styles/globals.css";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <MusicProvider>
          <Router>
            <div className="app-container">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/mood" element={<MoodSelector />} />
                  <Route path="/recommendations" element={<Recommendations />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
              <MusicPlayer />
            </div>
          </Router>
        </MusicProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
