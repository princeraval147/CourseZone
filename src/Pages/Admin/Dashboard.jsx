import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "../../Styles/Dashboard.module.css";
import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts";

const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [chartData, setChartData] = useState([]);

    // Transform course data for chart
    useEffect(() => {
        if (courses.length > 0) {
            const transformedData = courses.map(course => ({
                course: course.title,  // Use course title for X-axis
                students: course.enrolledStudents ? course.enrolledStudents.length : 0,  // Count students
            }));
            setChartData(transformedData);
        }
    }, [courses]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/my`, {
                    credentials: "include",
                });
                const data = await response.json();

                if (Array.isArray(data)) {
                    setCourses(data);
                } else if (data.courses && Array.isArray(data.courses)) {
                    setCourses(data.courses);
                } else {
                    console.error("Unexpected response data:", data);
                    setCourses([]);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                setCourses([]);
            } finally {
                null;
            }
        };
        fetchCourses();
    }, []);

    // Calculate total students & total earnings
    const totalStudents = courses.reduce((acc, course) => acc + (course.enrolledStudents?.length || 0), 0);
    const totalEarnings = courses.reduce((acc, course) => acc + (course.price * (course.enrolledStudents?.length || 0)), 0);

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
                        <p>
                            {courses.length}
                        </p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Total Students</h3>
                        <p>
                            {totalStudents}
                        </p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Total Earnings</h3>
                        <p>
                            ₹ {totalEarnings}
                        </p>
                    </div>
                </section>
                <div className={styles.chartContainer}>
                    <div>
                        <h2>Course Performance</h2>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={chartData}>
                                <XAxis dataKey="course" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="students" stroke="#FF5722" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
