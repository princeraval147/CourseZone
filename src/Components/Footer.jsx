import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import styles from '../Styles/Footer.module.css'

const Footer = () => {
    return (
        <>
            <footer className={styles.footer}>
                <div className={styles.footerContainer}>
                    <div className={styles.footerSection}>
                        <NavLink to='/'>
                            <img
                                src="/Img/CourseZone.png"
                                alt="CourseZone Logo"
                                height={85}
                                width={95}
                            />
                        </NavLink>
                        <p className={styles.footerText}>Delivering quality content and services to our users.</p>
                    </div>

                    <div className={styles.footerSection}>
                        <h3 className={styles.footerSubtitle}>Quick Links</h3>
                        <div className={styles.multipleLinks}>

                            <ul className={styles.footerLinks}>
                                <li>
                                    <NavLink to="/" className={styles.footerLink}>Home</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/contact" className={styles.footerLink}>Contact</NavLink>
                                </li>
                            </ul>
                            <ul>
                                <li>
                                    <NavLink to='/term-condition' className={styles.footerLink}>Term And Condition</NavLink>
                                </li>
                                <li>
                                    <NavLink to='/login' className={styles.footerLink}>Login</NavLink>
                                </li>
                                <li>
                                    <NavLink to='/course-list' className={styles.footerLink}>All Courses</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={styles.footerSection}>
                        <h3 className={styles.footerSubtitle}>Follow Us</h3>
                        <div className={styles.footerSocials}>
                            <a target='_blank' href="https://www.facebook.com/" className={styles.footerIcon}>
                                <FaFacebook />
                            </a>
                            <a target='_blank' href="https://x.com" className={styles.footerIcon}>
                                <FaTwitter />
                            </a>
                            <a target='_blank' href="https://instagram.com/" className={styles.footerIcon}>
                                <FaInstagram />
                            </a>
                            <a target='_blank' href="https://www.linkedin.com" className={styles.footerIcon}>
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    &copy; {new Date().getFullYear()} CourseZone. All rights reserved.
                </div>
            </footer>
        </>
    )
}

export default Footer
