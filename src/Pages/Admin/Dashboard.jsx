import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import styles from "../../Styles/Dashboard.module.css";

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.dashboardContainer}>
            <main className={styles.mainContent}>
                <header className={styles.dashboardHeader}>
                    <h1>Instructor Dashboard</h1>
                </header>

                <section className={styles.dashboardStats}>
                    <div className={styles.statCard}>
                        <h3>
                            <NavLink to='../my-course'>
                                Total Courses
                            </NavLink>
                        </h3>
                        <p>12</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Total Students</h3>
                        <p>450</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Total Earnings</h3>
                        <p>₹5,800</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
