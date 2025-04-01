import React, { useState, useEffect } from "react";
import styles from "../../styles/Sidebar.module.css";
import {
    FaTachometerAlt,
    FaBook,
    FaList,
    FaUserGraduate,
    FaVideo,
    FaChalkboardTeacher,
    FaUserCog,
    FaUsers,
    FaClipboardList,
    FaLaptopCode
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = ({ setSelectedTab, selectedTab }) => {

    const [userRole, setUserRole] = useState(null); // State to store the user role

    // Fetch user role on component mount
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/auth/me", {
                    credentials: "include", // Include cookies or authentication headers if necessary
                });

                if (res.ok) {
                    const roleData = await res.json();
                    setUserRole(roleData);
                } else {
                    console.error("Failed to fetch user role.");
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
            }
        };

        fetchUserRole();
    }, []);

    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>Admin Panel</div>

            <ul className={styles.navList}>
                <li>
                    <NavLink
                        to='dashboard'
                        className={selectedTab === "dashboard" ? styles.active : ""}
                    >
                        <FaTachometerAlt className={styles.icon} />
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='add-course'
                        className={selectedTab === "addcourse" ? styles.active : ""}
                    >
                        <FaBook className={styles.icon} />
                        Add Course
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='my-course'
                        className={selectedTab === "mycourses" ? styles.active : ""}
                    >
                        <FaList className={styles.icon} />
                        My Courses
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='student'
                        className={selectedTab === "studentenrolled" ? styles.active : ""}
                    >
                        <FaUserGraduate className={styles.icon} />
                        Student Enrolled
                    </NavLink>
                </li>
                <li>
                    <NavLink to='add-lecture'>
                        <FaVideo className={styles.icon} />
                        Add Lecture
                    </NavLink>
                </li>
                <li>
                    <NavLink to='manage-lecture' >
                        <FaChalkboardTeacher className={styles.icon} />
                        Manage Lectures
                    </NavLink>
                </li>

                {userRole === "admin" && (
                    <>
                        <h1>Only For Admin</h1>
                        <li>
                            <NavLink to='manage-instructor'>
                                <FaUsers className={styles.icon} />
                                Approve Instructors
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='show-all-course'>
                                <FaClipboardList className={styles.icon} />
                                Show All Course
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to=''>
                                <FaUsers className={styles.icon} />
                                All Course Enrolled Student
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to=''>
                                <FaLaptopCode className={styles.icon} />
                                Manage Instructors
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to=''>
                                <FaClipboardList className={styles.icon} />
                                Show All Course Review
                            </NavLink>
                        </li>
                    </>
                )}

            </ul>
        </div >
    );
};

export default Sidebar;
