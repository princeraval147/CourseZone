import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'
import '../index.css';
import { useNavigate } from "react-router-dom";
import styles from "../styles/Header.module.css";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    // useEffect(() => {
    const checkLoginStatus = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/isloggedin`, {
                credentials: "include",
            });

            if (res.ok) {
                setIsLoggedIn(true);
                const roleRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                    credentials: "include",
                });
                const role = await roleRes.json();
                setUserRole(role);
            } else {
                setIsLoggedIn(false);
                setUserRole(null);
            }
        } catch (error) {
            console.error("Error checking login status:", error);
        }
    };
    checkLoginStatus();
    // }, []);

    const handleLogout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
            setIsLoggedIn(false);
            setUserRole(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        <>
            <div className={styles.header}>
                <h3>Course Zone</h3>
                <ul className={styles.headerLinks}>
                    <li>
                        <NavLink to='/'>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/#About'>
                            About
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/contact'>
                            Contact Us
                        </NavLink>
                    </li>
                    {userRole === "instructor" && <NavLink to="/admin">Dashboard</NavLink>}
                </ul>
                <div>
                    {
                        isLoggedIn ? (
                            <button onClick={handleLogout} className='Btn'>
                                Logout
                            </button>
                        ) : (
                            <NavLink to='login' className='link'>
                                Login / Register
                            </NavLink>
                        )
                    }

                </div>
            </div>
        </>
    )
}

export default Header
