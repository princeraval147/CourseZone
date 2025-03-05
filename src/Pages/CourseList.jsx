import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import styles from "../styles/CourseList.module.css";
import CourseCard from "./CourseCard";
import useAuth from "../Components/hooks/useAuth";

const CourseList = () => {

    const isAuthenticated = useAuth();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/courses`); // Adjust URL as per your backend
                const data = await response.json();
                setCourses(data.courses); // Assuming API returns { courses: [...] }
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Filter courses based on search query
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.courseListContainer}>
            <h2 className={styles.heading}>Course List</h2>
            <p className={styles.breadcrumb}>Home / Course List</p>

            {/* Search Bar */}
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search for courses"
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className={styles.searchButton}>Search</button>
            </div>

            {loading ? (
                <p>Loading courses...</p>
            ) : (
                <div className={styles.coursesGrid}>
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <div key={course._id} onClick={() => navigate(`/course-details/${course._id}`)} className={styles.courseCardWrapper}>
                                <CourseCard
                                    image={course.courseImage}
                                    title={course.title}
                                    instructor={course.instructor?.username || "Unknown Instructor"} // Handle missing instructor
                                    price={`${course.price}`}
                                    oldPrice={`${course.oldPrice}`}
                                    discount={course.discount}
                                />
                            </div>
                        ))
                    ) : (
                        <p>No courses found</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseList;
