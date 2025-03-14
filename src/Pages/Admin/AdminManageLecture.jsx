import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "../../styles/AdminManageLecture.module.css";

const AdminManageLectures = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [lectures, setLectures] = useState([]);
    const [selectedLecture, setSelectedLecture] = useState("");
    const [lectureTitle, setLectureTitle] = useState("");
    const [lectureVideo, setLectureVideo] = useState(null);

    // Fetch courses
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/courses`, {
                    credentials: "include",
                });
                const data = await response.json();


                if (data.success && Array.isArray(data.courses)) {
                    setCourses(data.courses);
                } else {
                    console.error("Expected an array of courses, but got:", data);
                    setCourses([]);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
        fetchCourses();
    }, []);

    // Fetch lectures when course changes
    useEffect(() => {
        if (!selectedCourse) return;
        const fetchLectures = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/${selectedCourse}/lectures`, {
                    credentials: "include",
                });
                const data = await response.json();

                if (data.lectures && Array.isArray(data.lectures)) {
                    setLectures(data.lectures);
                } else {
                    console.error("Expected an array of lectures, but got:", data);
                    setLectures([]);
                }
            } catch (error) {
                console.error("Error fetching lectures:", error);
            }
        };
        fetchLectures();
    }, [selectedCourse]);

    // Update Lecture
    const handleUpdateLecture = async () => {
        if (!selectedLecture) return Swal.fire("Error", "Please select a lecture", "error");

        const formData = new FormData();
        formData.append("lectureTitle", lectureTitle);
        if (lectureVideo) formData.append("lectureVideo", lectureVideo);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/lectures/update/${selectedLecture}`, {
                method: "PUT",
                body: formData,
                credentials: "include",
            });
            const data = await response.json();
            Swal.fire("Success", data.message, "success");
        } catch (error) {
            Swal.fire("Error", "Failed to update lecture", "error");
        }
    };

    // Delete Lecture
    const handleDeleteLecture = async () => {
        if (!selectedLecture) return Swal.fire("Error", "Please select a lecture", "error");

        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/lectures/delete/${selectedCourse}/${selectedLecture}`, {
                        method: "DELETE",
                        credentials: "include",
                    });
                    const data = await response.json();
                    Swal.fire("Deleted!", data.message, "success");
                    setLectures(lectures.filter((lecture) => lecture._id !== selectedLecture));
                } catch (error) {
                    Swal.fire("Error", "Failed to delete lecture", "error");
                }
            }
        });
    };

    return (
        <div className={styles.container}>
            <h2>Manage Lectures</h2>

            <div className={styles.selectContainer}>
                <label>Select Course:</label>
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className={styles.selectBox}>
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

            <div className={styles.selectContainer}>
                <label>Select Lecture:</label>
                <select value={selectedLecture} onChange={(e) => setSelectedLecture(e.target.value)} className={styles.selectBox}>
                    <option value="">-- Select Lecture --</option>
                    {lectures.length > 0 ? (
                        lectures.map((lecture) => (
                            <option key={lecture._id} value={lecture._id}>
                                {lecture.lectureTitle}
                            </option>
                        ))
                    ) : (
                        <option disabled>No lectures available</option>
                    )}
                </select>
            </div>

            <div className={styles.formGroup}>
                <label>Update Lecture Title:</label>
                <input
                    type="text"
                    value={lectureTitle}
                    onChange={(e) => setLectureTitle(e.target.value)}
                    placeholder="Enter new title"
                    className={styles.inputField}
                />
            </div>

            <div className={styles.formGroup}>
                <label>Upload New Video:</label>
                <input
                    type="file"
                    accept="video/mp4"
                    onChange={(e) => setLectureVideo(e.target.files[0])}
                    className={styles.inputField}
                />
            </div>

            <div className={styles.buttonGroup}>
                <button onClick={handleUpdateLecture} className={`${styles.button} ${styles.updateButton}`}>
                    Update Lecture
                </button>
                <button onClick={handleDeleteLecture} className={`${styles.button} ${styles.deleteButton}`}>
                    Delete Lecture
                </button>
            </div>
        </div>
    );
};

export default AdminManageLectures;
