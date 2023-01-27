import React from "react";
import {
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider, RequireAuth } from "./auth";
import Layout from './components/Layout';

// Pages
import Login from "./pages/Login";
import KeyFinder from "./pages/KeyFinder";
import Tuner from "./pages/Tuner";
import Metronome from "./pages/Metronome";

const PublicPage = () => <h3>Public</h3>;
const ProtectedPage = () => <h3>Protected</h3>;

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PublicPage />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/key-finder" element={<KeyFinder/>} />
          <Route path="/metronome" element={<Metronome/>} />
          <Route path="/tuner" element={<Tuner/>} />
          <Route
            path="/protected"
            element={
              <RequireAuth>
                <ProtectedPage />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );  
}