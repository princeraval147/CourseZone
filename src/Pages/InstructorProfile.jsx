import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles/InstructorProfile.module.css";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const InstructorProfile = () => {

    const { id } = useParams();
    const [instructor, setInstructor] = useState(null);
    const [courses, setCourses] = useState([]);
    const Navigate = useNavigate();

    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/instructor/${id}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                if (data.success) {
                    setInstructor(data.instructor);
                    setCourses(data.courses);
                }
            } catch (error) {
                console.error("Error fetching instructor data:", error);
            }
        };
        fetchInstructorData();
    }, [id]);

    const totalCourse = courses.length;

    console.log("courses = ", courses);

    if (!instructor) return <p>Loading instructor profile...</p>;

    return (
        <div className={styles.instructorProfileContainer}>
            <div className={styles.instructorInfo}>
                <img src={instructor.photoUrl} alt={instructor.username} className={styles.avatar} />
                <div className={styles.aboutInstructor}>
                    <h1>{instructor.username}</h1>
                    <p>Email: {instructor.email}</p>
                    <span className={styles.totalCourse}><PlayCircleIcon /> {totalCourse} Courses Uploaded </span>
                </div>
            </div>

            <div className={styles.coursesSection}>
                <h2>Courses by {instructor.username}</h2>
                {courses.length > 0 ? (
                    <div className={styles.courseList}>
                        {courses.map((course) => (
                            <div
                                key={course._id}
                                className={styles.courseCard}
                                onClick={() => Navigate(`/course-details/${course._id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <img src={course.courseImage} alt={course.title} />
                                <h3>{course.title}</h3>
                                <p>{course.description.substring(0, 100)}...</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No courses uploaded yet.</p>
                )}
            </div>
        </div>
    );
};

export default InstructorProfile;
