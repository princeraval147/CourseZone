import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "../../styles/AddLecture.module.css";
import { ClipLoader } from "react-spinners";

const AddLecture = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [lectureTitle, setLectureTitle] = useState("");
    const [lectureVideo, setLectureVideo] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/my`, { credentials: "include" });
                const data = await response.json();

                if (Array.isArray(data)) {
                    setCourses(data);
                } else if (data && Array.isArray(data.courses)) {
                    setCourses(data.courses);
                } else {
                    console.error("Unexpected courses format:", data);
                    setCourses([]);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                setCourses([]);
            }
        };

        fetchCourses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCourse || !lectureTitle || !lectureVideo) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please fill in all fields, including the video!",
            });
            return;
        }

        const formData = new FormData();
        formData.append("courseId", selectedCourse);
        formData.append("lectureTitle", lectureTitle);
        formData.append("lectureVideo", lectureVideo);

        // Start loading spinner
        setIsUploading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/lectures/add`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const result = await response.json();

            // Stop loading spinner
            setIsUploading(false);

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Lecture Uploaded!",
                    text: "Your lecture has been uploaded successfully!",
                });
                setLectureTitle("");
                setLectureVideo(null);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed to Upload Lecture",
                    text: result.message || "Something went wrong while uploading the lecture.",
                });
            }
        } catch (error) {
            console.error("Error uploading lecture:", error);

            setIsUploading(false);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "There was an issue uploading the lecture.",
            });
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Add Lecture</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Select Course:</label>
                    <select
                        className={styles.input}
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="">-- Select Course --</option>
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <option key={course._id} value={course._id}>
                                    {course.title}
                                </option>
                            ))
                        ) : (
                            <option disabled>No courses available</option>
                        )}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Lecture Title:</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        placeholder="Enter lecture title"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Upload Lecture Video:</label>
                    <input
                        type="file"
                        className={styles.input}
                        accept="video/*"
                        onChange={(e) => setLectureVideo(e.target.files[0])}
                    />
                </div>

                {/* Show the spinner when uploading */}
                {isUploading ? (
                    <div className={styles.spinnerContainer}>
                        <ClipLoader size={50} color={"#36d7b7"} loading={isUploading} />
                        <p>Uploading video...</p>
                    </div>
                ) : (
                    <button className={styles.button} type="submit">
                        Upload Lecture
                    </button>
                )}
            </form>
        </div>
    );
};

export default AddLecture;
