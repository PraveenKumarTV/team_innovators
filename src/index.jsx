// eslint-disable-next-line no-unused-vars
import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import WebcamCapture from './components/webcamcapture';
import SidePanel from './components/sidepanel';
import CodeEventBlogger from './components/CodeEventBlogger';
import './style/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Header />
      <div className="main-content">
        <SidePanel side="left" />
        <Routes>
          <Route path="/" element={<WebcamCapture />} />
          <Route path="/event-blogger" element={<CodeEventBlogger />} />
        </Routes>
        <SidePanel side="right" />
      </div>
    </Router>
  </StrictMode>
);
