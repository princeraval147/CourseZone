import React, { useEffect, useState } from "react";
import styles from "../../styles/MyCourse.module.css";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

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
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Function to handle delete course
    const handleDelete = (courseId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/${courseId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });
                    const data = await response.json();

                    if (data.success) {
                        Swal.fire("Deleted!", data.message, "success");
                        setCourses(courses.filter(course => course._id !== courseId));
                    } else {
                        Swal.fire("Error", data.message, "error");
                    }
                } catch (error) {
                    Swal.fire("Error", "There was an issue deleting the course.", "error");
                }
            }
        });
    };

    const handleUpdate = (courseId) => {
        navigate(`/update-course/${courseId}`);
    };

    return (
        <div className={styles.container}>
            <h2>My Courses</h2>

            {loading ? (
                <p>Loading courses...</p>
            ) : (
                <div className={styles.courseTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>All Courses</th>
                                <th>Earnings</th>
                                <th>Students</th>
                                {/* <th>Course Status</th> */}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length > 0 ? (
                                courses.map((course) => {

                                    const earnings = course.price * (course.enrolledStudents ? course.enrolledStudents.length : 0);
                                    return (
                                        <tr key={course._id}>
                                            <td className={styles.courseInfo}>

                                                <img
                                                    src={course.courseImage}
                                                    alt={course.title}
                                                    className={styles.courseImage}
                                                />
                                                {course.title}
                                            </td>
                                            <td>₹{earnings.toFixed(2)}</td>
                                            <td>{course.enrolledStudents ? course.enrolledStudents.length : 0}</td>
                                            <td className={styles.Btns}>
                                                <button
                                                    className={styles.updateButton}
                                                    onClick={() => handleUpdate(course._id)}
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    className={styles.deleteButton}
                                                    onClick={() => handleDelete(course._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5">No courses found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )
            }
        </div >
    );
};

export default MyCourses;
