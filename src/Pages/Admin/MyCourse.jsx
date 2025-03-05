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
                const response = await fetch(`${import.meta.env.VITE_API_URL}/courses`);
                const data = await response.json();

                console.log("API Response Data:", data); // Debugging line to check the structure

                // Check if the API returns an array or nested data
                if (Array.isArray(data)) {
                    setCourses(data);
                } else if (data.courses && Array.isArray(data.courses)) {
                    setCourses(data.courses); // If the courses are nested in a 'courses' key
                } else {
                    console.error("Unexpected response data:", data);
                    setCourses([]); // Optionally, set empty courses to show no courses message
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                setCourses([]); // Optionally, set empty courses to show no courses message
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
                        setCourses(courses.filter(course => course._id !== courseId)); // Remove the deleted course from state
                    } else {
                        Swal.fire("Error", data.message, "error");
                    }
                } catch (error) {
                    Swal.fire("Error", "There was an issue deleting the course.", "error");
                }
            }
        });
    };
    console.log("Course = ", courses.price)

    // Function to handle course update (Placeholder - actual update functionality will come later)
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
                                <th>Course Status</th>
                                <th>Actions</th> {/* Added column for actions */}
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <tr key={course._id}>
                                        <td className={styles.courseInfo}>
                                            {/* Ensure course.image exists before rendering */}
                                            <img
                                                src={`http://localhost:5000/image/course-thumbnail/${course.courseImage}` || "/default-course.png"} // Fallback image if no image provided
                                                alt={course.title}
                                                className={styles.courseImage}
                                            />
                                            {course.title}
                                        </td>
                                        <td>
                                            $100
                                        </td> {/* Hardcoded earnings */}
                                        <td>25</td> {/* Hardcoded student count */}
                                        <td>
                                            <label className={styles.toggleSwitch}>
                                                <input
                                                    type="checkbox"
                                                    checked={course.status === "Live"}
                                                    readOnly
                                                />
                                                <span className={styles.slider}></span>
                                            </label>
                                            {course.status}
                                        </td>
                                        <td>
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No courses found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyCourses;
