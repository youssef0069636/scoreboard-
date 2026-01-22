import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { ScoreboardOverlay } from './components/Overlay/ScoreboardOverlay';
import { ControlPanel } from './components/Controller/ControlPanel';

const Menu: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-8 font-teko">
    <h1 className="text-6xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
      PRO SCOREBOARD SYSTEM
    </h1>
    <div className="flex gap-8">
      <Link 
        to="/control" 
        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg text-2xl font-bold shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all transform hover:scale-105"
      >
        OPEN CONTROLLER
      </Link>
      <Link 
        to="/overlay" 
        className="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-2xl font-bold shadow-lg transition-all transform hover:scale-105"
      >
        OPEN OVERLAY (OBS)
      </Link>
    </div>
    <p className="text-slate-500 max-w-md text-center font-sans mt-8">
      Open "Controller" in one tab and "Overlay" in another. 
      Use the Controller to drive the scoreboard in real-time. 
      Add the Overlay URL to OBS as a Browser Source (1920x1080).
    </p>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/overlay" element={<ScoreboardOverlay />} />
        <Route path="/control" element={<ControlPanel />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
