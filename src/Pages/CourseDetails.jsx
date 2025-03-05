import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/CourseDetails.module.css";
import useAuth from "../Components/hooks/useAuth";

const CourseDetails = () => {

    const isAuthenticated = useAuth();

    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [openSections, setOpenSections] = useState({});

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/${id}`);
                const data = await response.json();
                if (data.success) {
                    setCourse(data.course);
                }
            } catch (error) {
                console.error("Error fetching course details:", error);
            }
        };
        fetchCourse();
    }, [id]);

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    if (!course) return <p>Loading...</p>;

    return (
        <div className={styles.courseDetailsContainerUnique}>
            {/* Left Side - Course Details */}
            <div className={styles.courseDetailsUnique}>
                <header className={styles.courseHeaderUnique}>
                    <h1>{course.title}</h1>
                    <p>{course.description}</p>
                    <p>Instructor: {course.instructor?.username}</p>
                    <p>Language: Hindi</p>
                </header>

                {/* Course Structure */}
                <div className={styles.courseStructureUnique}>
                    <h2>Course Structure</h2>
                    {course.courseSections.map((section, index) => (
                        <div key={index} className={styles.courseSectionUnique}>
                            <div className={styles.courseSectionTitleUnique} onClick={() => toggleSection(index)}>
                                <span>📂 {section.sectionTitle}</span>
                                <span>{openSections[index] ? "▼" : "▶"}</span>
                            </div>
                            {openSections[index] && (
                                <ul>
                                    {section.lessons.map((lesson, lessonIndex) => (
                                        <li key={lessonIndex}>📘 {lesson.title} - <span>{lesson.duration}</span></li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side - Course Card */}
            <div className={styles.courseCardUnique}>
                <img src={`http://localhost:5000/image/course-thumbnail/${course.courseImage}`} alt={course.title} className={styles.courseImageUnique} />
                <div className={styles.courseCardHeaderUnique}>
                    <h3>{course.title}</h3>
                </div>
                <div className={styles.priceUnique}>
                    <span className={styles.currentPriceUnique}>₹{course.price}</span>
                    <span className={styles.oldPriceUnique}>₹{course.oldPrice}</span>
                    <span className={styles.discountUnique}>
                        {Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100)}% off
                    </span>
                </div>
                <button className={styles.enrollBtnUnique}>Enroll Now</button>

                <h4>What's in the course?</h4>
                <ul className={styles.courseBenefitsUnique}>
                    {course.courseBenefits.map((benefit, index) => (
                        <li key={index}>✅ {benefit}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CourseDetails;
