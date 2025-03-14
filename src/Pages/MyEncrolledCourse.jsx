import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../Styles/MyEncrolledCourse.module.css";  // Make sure you have this file for styles
import useAuth from "../Components/hooks/useAuth";

const MyEncrolledCourse = () => {
    useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/my-courses`, {
                    credentials: "include", // If your API requires credentials (cookies)
                });
                const data = await response.json();

                if (data.success) {
                    setCourses(data.courses);
                } else {
                    setError(data.message || "Something went wrong. Please try again.");
                }
            } catch (error) {
                setError("Error fetching enrolled courses. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, []);

    if (loading) return <p>Loading enrolled courses...</p>;

    if (error) return <p>{error}</p>;

    if (!courses.length) return <p>You are not enrolled in any courses.</p>;

    return (
        <>

            <div className={styles.myCoursesContainer}>
                <h2>My Enrolled Courses</h2>
                <div className={styles.courseGrid}>
                    {courses.map((course) => (
                        <div key={course._id} className={styles.courseCard}>
                            <img
                                src={`http://localhost:5000/image/course-thumbnail/${course.courseImage}`}
                                alt={course.title}
                                className={styles.courseImage}
                            />
                            <h3 className={styles.courseTitle}>{course.title}</h3>
                            <Link to={`/classroom/${course._id}`} className={styles.goToClassroomBtn}>
                                Go to Classroom
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MyEncrolledCourse;
