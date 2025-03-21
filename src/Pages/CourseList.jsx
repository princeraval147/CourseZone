import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/CourseList.module.css";
import CourseCard from "./CourseCard";
import useAuth from "../Components/hooks/useAuth";

const CourseList = () => {
    const isAuthenticated = useAuth();

    const [courses, setCourses] = useState([]);
    const [savedCourses, setSavedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState([0, 3000]); // Example price range in INR
    const [selectedLanguage, setSelectedLanguage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/courses`);
                const data = await response.json();
                setCourses(data.courses);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchSavedCourses = async () => {
                try {
                    const response = await fetch("http://localhost:5000/api/auth/saved-courses", {
                        method: "GET",
                        credentials: "include",
                    });
                    if (response.ok) {
                        const savedData = await response.json();
                        setSavedCourses(savedData.map(course => course._id));
                    }
                } catch (error) {
                    console.error("Error fetching saved courses:", error);
                }
            };

            fetchSavedCourses();
        }
    }, [isAuthenticated]);

    const filteredCourses = courses.filter(course => {
        // Apply the filters
        const matchesSearchQuery = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1];
        const matchesLanguage = selectedLanguage ? course.language === selectedLanguage : true;

        return matchesSearchQuery && matchesPrice && matchesLanguage;
    });

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
                {/* <button className={styles.searchButton}>Search</button> */}
            </div>

            {/* Filters Section */}
            <div className={styles.filtersContainer}>
                <div className={styles.filterItem}>
                    <label>Price Range (INR)</label>
                    <input
                        type="range"
                        min="0"
                        max="3000"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className={styles.priceSlider}
                    />
                    <input
                        type="range"
                        min="0"
                        max="3000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className={styles.priceSlider}
                    />
                    <div>{`Price: ₹${priceRange[0]} - ₹${priceRange[1]}`}</div>
                </div>

                <div className={styles.filterItem}>
                    <label>Language</label>
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="">All Languages</option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        {/* Add other languages as needed */}
                    </select>
                </div>
            </div>

            {loading ? (
                <p>Loading courses...</p>
            ) : (
                <div className={styles.coursesGrid}>
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <div
                                key={course._id}
                                onClick={() => navigate(`/course-details/${course._id}`)}
                                className={styles.courseCardWrapper}
                            >
                                <CourseCard
                                    image={course.courseImage}
                                    title={course.title}
                                    instructor={course.instructor?.username || "Unknown Instructor"}
                                    price={`${course.price}`}
                                    oldPrice={`${course.oldPrice}`}
                                    discount={course.discount}
                                    courseId={course._id}
                                    isSaved={savedCourses.includes(course._id)}
                                    created={course.createdAt}
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
