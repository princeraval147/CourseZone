import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "../../Styles/UpdateCourse.module.css"; // Reusing AddCourse styles

const UpdateCourse = () => {
    const { id } = useParams(); // Get course ID from URL
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/courses/${id}`
                );
                const data = await response.json();

                if (data.success) {
                    setCourseData(data.course);
                } else {
                    Swal.fire("Error", "Course not found", "error");
                    navigate("/my-courses"); // Redirect if course not found
                }
            } catch (error) {
                Swal.fire("Error", "Failed to fetch course details", "error");
            }
        };

        fetchCourseDetails();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setCourseData((prev) => ({ ...prev, courseImage: file }));
    };

    // Handle adding a new course section
    const addSection = () => {
        setCourseData((prev) => ({
            ...prev,
            courseSections: [
                ...prev.courseSections,
                { sectionTitle: "", lessons: [] },
            ],
        }));
    };

    // Handle changing section title
    const handleSectionChange = (index, value) => {
        const updatedSections = [...courseData.courseSections];
        updatedSections[index].sectionTitle = value;
        setCourseData((prev) => ({ ...prev, courseSections: updatedSections }));
    };

    // Handle adding a lesson to a section
    const addLesson = (sectionIndex) => {
        const updatedSections = [...courseData.courseSections];
        updatedSections[sectionIndex].lessons.push({ title: "", duration: "" });
        setCourseData((prev) => ({ ...prev, courseSections: updatedSections }));
    };

    // Handle changing lesson details
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

        formData.append(
            "courseSections",
            JSON.stringify(courseData.courseSections)
        );

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/courses/${id}`,
                {
                    method: "PUT",
                    body: formData,
                    credentials: "include",
                }
            );

            const text = await response.text();
            console.log("Response Text:", text);

            const result = JSON.parse(text);

            if (response.ok) {
                Swal.fire("Success", "Course updated successfully", "success");
                navigate("/admin/my-course");
            } else {
                Swal.fire("Error", result.message, "error");
            }
        } catch (error) {
            Swal.fire("Error", "Failed to update course", "error");
        }
    };

    return (
        <div className={styles.updateCourseContainer}>
            <h2>Update Course</h2>
            <form onSubmit={handleSubmit} className={styles.courseForm}>
                <div className={styles.formParts}>
                    <div className={styles.firstPart}>
                        <div className={styles.inputGroup}>
                            <label>Course Title</label>
                            <input
                                type="text"
                                name="title"
                                value={courseData.title}
                                onChange={handleChange}
                                placeholder="Enter course title"
                            />
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

                        <div className={styles.priceWrapper}>
                            <div className={styles.inputGroup}>
                                <label>Course Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={courseData.price}
                                    onChange={handleChange}
                                    placeholder="Enter price"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Old Price</label>
                                <input
                                    type="number"
                                    name="oldPrice"
                                    value={courseData.oldPrice}
                                    onChange={handleChange}
                                    placeholder="Enter old price"
                                />
                            </div>
                        </div>

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
                    </div>

                    <div className={styles.secondPart}>

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
                            {courseData.courseImage && courseData.courseImage instanceof File && (
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
                                        onChange={(e) =>
                                            handleSectionChange(sectionIndex, e.target.value)
                                        }
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
                                                onChange={(e) =>
                                                    handleLessonChange(
                                                        sectionIndex,
                                                        lessonIndex,
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Lesson title"
                                            />
                                            <input
                                                type="text"
                                                value={lesson.duration}
                                                onChange={(e) =>
                                                    handleLessonChange(
                                                        sectionIndex,
                                                        lessonIndex,
                                                        "duration",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Lesson duration (e.g., 2 hours)"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addSection}
                                className={styles.addSectionBtn}
                            >
                                + Add Section
                            </button>
                        </div>

                    </div>
                </div>

                <button type="submit" className={styles.submitBtn}>
                    Update Course
                </button>
            </form>
        </div>
    );
};

export default UpdateCourse;
