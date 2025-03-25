import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../Styles/Home.module.css'
import CourseCard from './CourseCard'
import { motion } from "framer-motion";

const Home = () => {
    const [courses, setCourses] = useState([]); // Store fetched courses
    const navigate = useNavigate();

    // Fetch all courses and filter the newest 4
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/courses"); // Fetch all courses
                const data = await response.json();

                if (data.success) {
                    // Sort courses by newest (assuming 'createdAt' field exists)
                    const sortedCourses = data.courses
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    // .slice(0, 4); // Get the latest 4 courses

                    setCourses(sortedCourses);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchCourses();
    }, []);

    const handleShowAllCourses = () => {
        navigate("/course-list");
    };



    const repeatedCourses = [...courses, ...courses];

    return (
        <>
            <div className={styles.homeContainer}>
                <div className={styles.homeTxt}>
                    <h2 className={styles.homeHeading}>All the skills you need in one place</h2>
                    <p>From critical skills to technical topics, <strong> Course Zone</strong> supports your professional development.</p>
                </div>
                <div>
                    <img
                        className={styles.img}
                        height={350}
                        src="https://media.istockphoto.com/id/637711198/photo/hand-with-marker-writing-skill-concept.jpg?s=612x612&w=0&k=20&c=Dq1KVhcx71mfFq36b8Ieaz-H9IKCdu9YdDSkY_5XfM4="
                        alt="Skills Image"
                    />
                </div>
            </div>

            <div className={styles.home}>
                {/* Courses Section */}
                <section className={styles.courses}>
                    <h2>Learn from the best</h2>
                    <p>Discover our top-rated courses across various categories.</p>
                    <div className={styles.courseGrid}>
                        {/* {courses.map((course) => (
                            <CourseCard
                                key={course._id}
                                image={course.courseImage}
                                title={course.title}
                                instructor={course.instructor?.username || "Unknown"}
                                price={`${course.price}`}
                                oldPrice={`${course.oldPrice}`}
                                created={course.createdAt}
                            />
                        ))} */}
                        <div className={styles.carouselContainer}>
                            <motion.div
                                className={styles.carousel}
                                animate={{ x: ["0%", "-50%"] }} // Moves halfway so the second set overlaps the first
                                transition={{ ease: "linear", duration: 20, repeat: Infinity }} // Smooth infinite scroll
                            >
                                {repeatedCourses.map((course, index) => (
                                    <CourseCard
                                        key={index}
                                        image={course.courseImage}
                                        title={course.title}
                                        instructor={course.instructor?.username || "Unknown"}
                                        price={`${course.price}`}
                                        oldPrice={`${course.oldPrice}`}
                                        created={course.createdAt}
                                    />
                                ))}
                            </motion.div>
                        </div>
                    </div>
                    <button onClick={handleShowAllCourses} className={styles.showMore}>
                        Show all courses
                    </button>
                </section>

                {/* Final CTA */}
                <section className={styles.finalCta}>
                    <h2>Want to become a Instructor</h2>
                    <p>Join thousands of learners and start your journey today.</p>
                    <NavLink to='/request-instructor' className={styles.getStarted}>
                        Get Started
                    </NavLink>
                </section>





            </div >
        </>
    )
}

export default Home
