import React from "react";
import styles from "../styles/CourseCard.module.css";

const CourseCard = ({ image, title, instructor, price, oldPrice }) => {
    const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

    return (
        <div className={styles.courseCard}>
            <div className={styles.imageContainer}>
                <img
                    src={`http://localhost:5000/image/course-thumbnail/${image}` || "/default-course.png"}
                    // src="https://www.pankajkumarseo.com/wp-content/uploads/2022/06/React-Js-Course-Delhi.png"
                    alt={title}
                    className={styles.courseImage}
                />
            </div>
            <div className={styles.courseContent}>
                <h3 className={styles.courseTitle}>
                    {title}
                </h3>
                <p className={styles.courseInstructor}>
                    {instructor}
                </p>
                <div className={styles.priceContainer}>
                    <span className={styles.currentPrice}>
                        ₹{price}
                    </span>
                    {oldPrice && <span className={styles.oldPrice}>₹{oldPrice}</span>}
                    {oldPrice && discount > 0 && (
                        <span className={styles.discount}>{discount}% off</span>
                    )}
                </div>
            </div>
        </div >
    );
};

export default CourseCard;
