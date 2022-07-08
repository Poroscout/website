import React from 'react';
import "./assets/css/index.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './pages/home/Home';
import TermsOfService from './pages/tos/Terms';
import FourOhFour from './pages/404/404';
import RedirectRoute from './components/RedirectRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* <RedirectRoute path="/invite"  to="https://discord.com/api/oauth2/authorize?client_id=913190001007804426&permissions=537151488&scope=bot%20applications.commands" />
        <RedirectRoute path="/docs"    to="https://docs.poroscout.gg/" />
        <RedirectRoute path="/discord" to="https://discord.gg/dvvH6knvsG" />
        <RedirectRoute path="/vote"    to="https://top.gg/bot/913190001007804426/vote" /> */}

        { RedirectRoute({ path:"/invite",  to:"https://discord.com/api/oauth2/authorize?client_id=913190001007804426&permissions=537151488&scope=bot%20applications.commands" }) }
        { RedirectRoute({ path:"/docs",    to:"https://docs.poroscout.gg/" }) }
        { RedirectRoute({ path:"/discord", to:"https://discord.gg/dvvH6knvsG" }) }
        { RedirectRoute({ path:"/vote",    to:"https://top.gg/bot/913190001007804426/vote" }) }


        <Route path="/terms" element={<TermsOfService />} />
        <Route index element={<Home />} />
        <Route path="*" element={<FourOhFour />} />
      </Routes>
    </Router>
  );
}

export default App;
