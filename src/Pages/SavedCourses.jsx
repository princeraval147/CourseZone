import React, { useEffect, useState } from "react";
import styles from "../styles/savedCourses.module.css";
import useAuth from "../Components/hooks/useAuth";


const SavedCourses = () => {
    useAuth();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchSavedCourses = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/auth/saved-courses", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error("Error fetching saved courses", error);
            }
        };

        fetchSavedCourses();
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Saved Courses</h2>
            {courses.length === 0 ? (
                <p className={styles.noCourses}>No saved courses found.</p>
            ) : (
                <div className={styles.courseGrid}>
                    {courses.map((course) => (
                        <div key={course._id} className={styles.courseCard}>
                            <img
                                src={`http://localhost:5000/image/course-thumbnail/${course.courseImage}` || "/default-course.png"}
                                alt={course.title}
                                className={styles.courseImage}
                            />
                            <div className={styles.courseInfo}>
                                <h3 className={styles.courseTitle}>{course.title}</h3>
                                {/* <p className={styles.courseInstructor}>{course.instructor}</p> */}
                                <p className={styles.coursePrice}>₹{course.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedCourses;
