import React from 'react';
import "./assets/css/index.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './pages/home/Home';
import TermsOfService from './pages/tos/Terms';
import Redirect from './components/Redirect';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/invite" element={<Redirect to={"https://discord.com/api/oauth2/authorize?client_id=913190001007804426&permissions=537151488&scope=bot%20applications.commands"} />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route index element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
