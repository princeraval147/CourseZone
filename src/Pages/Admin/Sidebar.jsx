import React from "react";
import styles from "../../styles/Sidebar.module.css";
import { FaTachometerAlt, FaBook, FaList, FaUserGraduate } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = ({ setSelectedTab, selectedTab }) => {
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
            </ul>
        </div>
    );
};

export default Sidebar;
