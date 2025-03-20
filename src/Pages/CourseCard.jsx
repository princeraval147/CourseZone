import React, { useState, useEffect } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import styles from "../styles/CourseCard.module.css";

const CourseCard = ({ image, title, instructor, price, oldPrice, courseId, isSaved, created }) => {
    const [isCourseSaved, setIsCourseSaved] = useState(isSaved);

    useEffect(() => {
        setIsCourseSaved(isSaved);
    }, [isSaved]);

    const handleToggleSave = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/toggle-save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ courseId }),
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setIsCourseSaved(data.saved);
            } else {
                console.error("Failed to toggle saved course");
            }
        } catch (error) {
            console.error("Error toggling saved course:", error);
        }
    };

    const calculateDiscount = () => {
        if (oldPrice && price) {
            return Math.round(((oldPrice - price) / oldPrice) * 100);
        }
        return 0;
    };

    const formatTimeAgo = (createdDate) => {
        const createdTime = new Date(createdDate);
        const now = new Date();
        const timeDiff = now - createdTime;

        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (years > 0) {
            return `${years} year${years > 1 ? "s" : ""} ago`;
        } else if (months > 0) {
            return `${months} month${months > 1 ? "s" : ""} ago`;
        } else if (days > 0) {
            return `${days} day${days > 1 ? "s" : ""} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        } else {
            return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
        }
    };

    return (
        <div className={styles.courseCard}>
            <div className={styles.imageContainer}>
                <img
                    src={image}
                    alt={title}
                    className={styles.courseImage}
                />
            </div>
            <div className={styles.courseContent}>
                <div className={styles.courseHeader}>
                    <h3 className={styles.courseTitle}>{title}</h3>
                    <button className={styles.saveButton} onClick={handleToggleSave}>
                        {isCourseSaved ? <FaBookmark className={styles.savedIcon} /> : <FaRegBookmark className={styles.saveIcon} />}
                    </button>
                </div>
                <p className={styles.courseInstructor}>{instructor}</p>
                <div className={styles.priceContainer}>
                    <span className={styles.currentPrice}>₹{price}</span>
                    {oldPrice && <span className={styles.oldPrice}>₹{oldPrice}</span>}
                    {oldPrice && calculateDiscount() > 0 && (
                        <span className={styles.discount}>{calculateDiscount()}% off</span>
                    )}
                </div>
                <div className={styles.postedDate}>Posted: {formatTimeAgo(created)}</div>
            </div>
        </div>
    );
};

export default CourseCard;
