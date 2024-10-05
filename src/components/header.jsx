// Header.jsx
import React from 'react';
import '../style/header.css';
import logo1 from "../assets/nss_logo.png";
import logo2 from "../assets/tce_logo.png";

const Header = () => {
    return (
        <header className="box-1">
            <div className='top-box'>
                <div className="logo-container">
                    <img src={logo2} alt="College Logo" className='logo' />
                    <img src={logo1} alt="Event Logo" className="logo" />
                </div>
                <div className='booth-name'>
                    <h1>Start Camera Snap</h1>
                </div>
                <div className="event-details">
                    <h1 className="event-title">NSS Day 2024</h1>
                    <a href="CodeEventBlogger.html" className="nav-link">Event Blogger</a>
                    <a href="http://localhost:3500" className="nav-link">Events</a> {/* Added Events link */}
                </div>
            </div>
        </header>
    );
};

export default Header;
