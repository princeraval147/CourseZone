import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Swal from "sweetalert2"; // Import SweetAlert2
import styles from "../../styles/AddCourse.module.css";

const AddCourse = () => {
    const [courseData, setCourseData] = useState({
        title: "",
        description: "",
        price: "",
        oldPrice: "",
        duration: "",
        language: "",
        courseBenefits: "",
        courseImage: null,
        courseSections: [],
    });
    // const [error, setError] = useState();
    const [courseExists, setCourseExists] = useState(false);

    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setCourseData((prev) => ({ ...prev, courseImage: file }));
    };

    const addSection = () => {
        setCourseData((prev) => ({
            ...prev,
            courseSections: [...prev.courseSections, { sectionTitle: "", lessons: [] }],
        }));
    };

    const handleSectionChange = (index, value) => {
        const updatedSections = [...courseData.courseSections];
        updatedSections[index].sectionTitle = value;
        setCourseData((prev) => ({ ...prev, courseSections: updatedSections }));
    };

    const addLesson = (sectionIndex) => {
        const updatedSections = [...courseData.courseSections];
        updatedSections[sectionIndex].lessons.push({ title: "", duration: "" });
        setCourseData((prev) => ({ ...prev, courseSections: updatedSections }));
    };

    const handleLessonChange = (sectionIndex, lessonIndex, field, value) => {
        const updatedSections = [...courseData.courseSections];
        updatedSections[sectionIndex].lessons[lessonIndex][field] = value;
        setCourseData((prev) => ({ ...prev, courseSections: updatedSections }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", courseData.title);
        formData.append("description", courseData.description);
        formData.append("price", courseData.price);
        formData.append("oldPrice", courseData.oldPrice);
        formData.append("duration", courseData.duration);
        formData.append("language", courseData.language);
        formData.append("courseBenefits", courseData.courseBenefits);

        if (courseData.courseImage) {
            formData.append("courseImage", courseData.courseImage);
        }

        formData.append("courseSections", JSON.stringify(courseData.courseSections));

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/add-course`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const text = await response.text();
            const result = JSON.parse(text);

            if (response.ok) {
                // Show success message using SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: 'Course Added!',
                    text: 'The course has been successfully added.',
                }).then(() => {
                    // Navigate to the course list page
                    navigate("/course-list");
                });
            } else {
                console.error("Error adding course:", result);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'There was an error adding the course.',
                });
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'There was an error submitting the form.',
            });
        }
    };

    const currentDate = new Date().toISOString().split('T')[0];

    const checkModelAvailability = async (courseTitle) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/checkCourse`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ title: courseTitle }),
            });
            const result = await response.json();
            if (response.ok && result.course) {
                setCourseExists(true);
            } else {
                setCourseExists(false);
            }
        } catch (error) {
            console.error("Error checking course availability:", error);
            setCourseExists(false);
        }
    };


    return (
        <>
            <div className={styles.addCourseContainer}>
                <h2 className={styles.AddHeadign}>Add New Course</h2>
                <form onSubmit={handleSubmit} className={styles.courseForm}>
                    <div className={styles.formParts}>
                        <div className={styles.firstPart}>
                            <div className={styles.inputGroup}>
                                <label>Course Title</label>
                                <input
                                    type="text"
                                    id="courseTitle"
                                    name="title"
                                    value={courseData.title}
                                    onChange={handleChange}
                                    placeholder="Enter course title"
                                    onBlur={(e) => checkModelAvailability(e.target.value)}
                                    className={courseExists ? styles.errorInput : ""}
                                />
                                {courseExists && <span className={styles.errorMessage}>Course already exists.</span>}
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Course Description</label>
                                <textarea
                                    name="description"
                                    value={courseData.description}
                                    onChange={handleChange}
                                    placeholder="Enter course description"
                                />
                            </div>

                            {/* <div className={styles.priceWrapper}> */}
                            <div className={styles.inputGroup}>
                                <label>Course Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={courseData.price}
                                    onChange={handleChange}
                                    placeholder="Enter price"
                                    min="1"
                                    max="1000"
                                    required
                                />
                            </div>
                            {/* </div> */}

                            <div className={styles.inputGroup}>
                                <label>Language</label>
                                <input
                                    type="text"
                                    name="language"
                                    value={courseData.language}
                                    onChange={handleChange}
                                    placeholder="Enter language (e.g., English)"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Duration</label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={courseData.duration}
                                    onChange={handleChange}
                                    placeholder="Enter duration (e.g., 3 months)"
                                />
                            </div>
                        </div>


                        <div className={styles.secondPart}>
                            <div className={styles.inputGroup}>
                                <label>Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    disabled
                                    value={currentDate}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Course Benefits (comma separated)</label>
                                <input
                                    type="text"
                                    name="courseBenefits"
                                    value={courseData.courseBenefits}
                                    onChange={handleChange}
                                    placeholder="e.g., No prior coding experience required, Certificate included"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Course Thumbnail</label>
                                <input type="file" accept="image/*" onChange={handleImageUpload} />
                                {courseData.courseImage && (
                                    <img
                                        src={URL.createObjectURL(courseData.courseImage)}
                                        alt="Course Preview"
                                        className={styles.previewImage}
                                    />
                                )}
                            </div>

                            {/* Course Sections */}
                            <div className={styles.sectionsContainer}>
                                <h3>Course Sections</h3>
                                {courseData.courseSections.map((section, sectionIndex) => (
                                    <div key={sectionIndex} className={styles.sectionBox}>
                                        <input
                                            type="text"
                                            value={section.sectionTitle}
                                            onChange={(e) => handleSectionChange(sectionIndex, e.target.value)}
                                            placeholder="Enter section title"
                                        />
                                        <button type="button" onClick={() => addLesson(sectionIndex)}>
                                            + Add Lesson
                                        </button>

                                        {section.lessons.map((lesson, lessonIndex) => (
                                            <div key={lessonIndex} className={styles.lessonBox}>
                                                <input
                                                    type="text"
                                                    value={lesson.title}
                                                    onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, "title", e.target.value)}
                                                    placeholder="Lesson title"
                                                />
                                                <input
                                                    type="text"
                                                    value={lesson.duration}
                                                    onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, "duration", e.target.value)}
                                                    placeholder="Lesson duration (e.g., 2 hours)"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))}

                                <button type="button" onClick={addSection} className={styles.addSectionBtn}>
                                    + Add Section
                                </button>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={courseExists}>
                        Add Course
                    </button>
                </form>
            </div >
        </>
    );
};

export default AddCourse;
