import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "../../styles/ReviewManage.module.css";

const ManageCourseReview = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [reviews, setReviews] = useState([]);


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/courses/my", {
                    credentials: "include",
                });
                const data = await response.json();
                console.log("Fetched courses:", data);
                if (data.success && Array.isArray(data.courses)) {
                    setCourses(data.courses);
                } else {
                    console.error("Unexpected response data:", data);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchCourses();
    }, []);


    const fetchReviews = async (courseId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/courses/${courseId}/reviews`);
            const data = await response.json();
            console.log("Fetched reviews:", data.reviews);


            if (data.reviews && Array.isArray(data.reviews)) {
                setReviews(data.reviews);
            } else {
                console.error("Unexpected response data:", data);
                setReviews([]);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setReviews([]);
        }
    };

    // Handling course selection change
    const handleCourseChange = (event) => {
        const courseId = event.target.value;
        setSelectedCourse(courseId);
        if (courseId) {
            fetchReviews(courseId);
        } else {
            setReviews([]);
        }
    };

    // Handling review deletion
    const handleDeleteReview = async (reviewId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/reviews/${reviewId}`, {
                        method: "DELETE",
                        credentials: "include",
                    });
                    const data = await response.json();
                    if (data.success) {
                        Swal.fire("Deleted!", data.message, "success");
                        setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
                    } else {
                        Swal.fire("Error", data.message, "error");
                    }
                } catch (error) {
                    Swal.fire("Error", "There was an issue deleting the review.", "error");
                }
            }
        });
    };

    return (
        <div className={styles.container}>
            <h2>Manage Reviews</h2>
            <select onChange={handleCourseChange} value={selectedCourse}>
                <option value="">Select a Course</option>
                {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                        {course.title}
                    </option>
                ))}
            </select>

            {/* Check if selectedCourse is set and reviews are available */}
            {selectedCourse && reviews.length > 0 ? (
                <div className={styles.reviewList}>
                    {reviews.map((review) => (
                        <div key={review._id} className={styles.reviewCard}>
                            <p>
                                <strong>{review.user?.username || "Unknown User"}:</strong> {review.reviewText}
                            </p>
                            <button className={styles.deleteButton} onClick={() => handleDeleteReview(review._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            ) : selectedCourse ? (
                <p>No reviews found for this course.</p> // Message when no reviews are found
            ) : null}
        </div>
    );
};

export default ManageCourseReview;
