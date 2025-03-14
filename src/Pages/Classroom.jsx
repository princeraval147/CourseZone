import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/Classroom.module.css";
import useEnrollment from "../Components/hooks/useEnrollment";

const Classroom = () => {
    const encrolled = useEnrollment();
    const { courseId } = useParams();
    const [lectures, setLectures] = useState([]);
    const [selectedLecture, setSelectedLecture] = useState(null);

    // Fetch lectures when component loads
    useEffect(() => {
        const fetchLectures = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/courses/${courseId}/lecturesdetails`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                const data = await response.json();


                if (Array.isArray(data.lectures)) {
                    setLectures(data.lectures);
                    setSelectedLecture(data.lectures[0]);
                } else {
                    console.error("Invalid lectures format:", data);
                }
            } catch (error) {
                console.error("Error fetching lectures:", error);
            }
        };
        fetchLectures();
    }, [courseId]);

    // Determine the full URL for the video
    const getVideoUrl = (videoUrl) => {
        if (videoUrl && !videoUrl.startsWith('http')) {
            return `http://localhost:5000${videoUrl}`;
        }
        return videoUrl;
    };

    return (
        <div className={styles.container}>
            {/* Left Side: Video Player */}
            <div className={styles.videoSection}>
                {selectedLecture ? (
                    <video
                        key={selectedLecture._id}
                        controls
                        controlsList="nodownload"
                        className={styles.videoPlayer}
                    >
                        <source
                            src={getVideoUrl(selectedLecture.videoUrl)}
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <p className={styles.noVideo}>Select a lecture to watch</p>
                )}
            </div>

            {/* Right Side: Lecture List */}
            <div className={styles.lectureList}>
                <h3 className={styles.lectureHeading}>Course Lectures</h3>
                <ul>
                    {lectures.map((lecture) => (
                        <li
                            key={lecture._id}
                            className={`${styles.lectureItem} ${selectedLecture?._id === lecture._id ? styles.active : ""
                                }`}
                            onClick={() => setSelectedLecture(lecture)}
                        >
                            {lecture.lectureTitle}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Classroom;
