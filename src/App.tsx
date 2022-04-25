import React from 'react';
import "./assets/css/index.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './pages/home/Home';
import TermsOfService from './pages/tos/Terms';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/terms" element={<TermsOfService />} />
        <Route index element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
