import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

const Footer = () => {
    return (
        <>
            <footer className="footer">
                <div className="footer-container">
                    {/* Logo & Description */}
                    <div className="footer-section">
                        <h2 className="footer-title">Course Zone</h2>
                        <p className="footer-text">Delivering quality content and services to our users.</p>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-subtitle">Quick Links</h3>
                        <ul className="footer-links">
                            <li>
                                <NavLink to="/" className="footer-link">Home</NavLink>
                            </li>
                            <li>
                                <NavLink to="/#About" className="footer-link">About</NavLink>
                            </li>
                            <li>
                                <NavLink to="#" className="footer-link">Services</NavLink>
                            </li>
                            <li>
                                <NavLink to="#" className="footer-link">Contact</NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-subtitle">Follow Us</h3>
                        <div className="footer-socials">
                            <a target='_blank' href="https://www.facebook.com/" className="footer-icon">
                                <FaFacebook />
                            </a>
                            <a target='_blank' href="https://x.com" className="footer-icon">
                                <FaTwitter />
                            </a>
                            <a target='_blank' href="https://instagram.com/" className="footer-icon">
                                <FaInstagram />
                            </a>
                            <a target='_blank' href="https://www.linkedin.com" className="footer-icon">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    &copy; {new Date().getFullYear()} CourseZone. All rights reserved.
                </div>
            </footer>
        </>
    )
}

export default Footer
