import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/CourseDetails.module.css";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [openSections, setOpenSections] = useState({});
    const [loading, setLoading] = useState(false);

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

        const checkEnrollment = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/is-enrolled/${id}`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();
                if (data.success) {
                    setIsEnrolled(data.isEnrolled);
                }
            } catch (error) {
                console.error("Error checking enrollment:", error);
            }
        };

        fetchCourse();
        checkEnrollment();
    }, [id]);

    const toggleSection = (section) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    if (!course) return <p>Loading...</p>;

    // Razorpay Payment Functions
    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleRazorpayScreen = async (orderData) => {
        setLoading(true);
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            Swal.fire("Error!", "Failed to load Razorpay. Please try again.", "error");
            return;
        }

        const options = {
            key: "rzp_test_wwpkm13Z4MY1Dv",
            amount: orderData.amount,
            currency: "INR",
            name: "Course Zone",
            description: "Payment to Course Zone",
            handler: async function (response) {
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/payment/payment-success`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            courseId: course._id,
                            razorpayOrderId: orderData.id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            amountPaid: orderData.amount / 100,
                        }),
                        credentials: "include",
                    });

                    const data = await res.json();
                    if (data.success) {
                        Swal.fire({
                            title: "Payment Successful!",
                            text: "You have been enrolled in the course.",
                            icon: "success",
                            confirmButtonText: "Go to My Courses",
                        }).then(() => {
                            navigate("/my-courses");
                        });
                    } else {
                        Swal.fire("Error!", "Payment recorded but enrollment failed. Contact support.", "error");
                    }
                } catch (error) {
                    console.error("Error saving payment:", error);
                    Swal.fire("Error!", "Something went wrong. Please try again.", "error");
                }
            },
            prefill: {
                name: "Course Zone",
                email: "coursezonebusiness@gmail.com",
            },
            theme: {
                color: "#F4C430",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        setLoading(false);
    };

    const createRazorpayOrder = async (payableAmount) => {
        setLoading(true);
        const orderData = {
            amount: payableAmount,
            currency: "INR",
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
                credentials: "include",
            });

            const data = await response.json();
            if (data.success) {
                await handleRazorpayScreen(data.order);
            } else {
                console.error("Error creating Razorpay order:", data.message);
            }
        } catch (error) {
            console.error("Error in creating order:", error);
        }
        setLoading(false);
    };

    return (
        <div className={styles.courseDetailsContainerUnique}>
            {
                loading && (
                    <div className={styles.loadingOverlay}>
                        <CircularProgress size={60} color="primary" />
                        <p className={styles.loadingText}>Processing Payment...</p>
                    </div>
                )
            }
            <div className={styles.courseDetailsUnique}>
                <header className={styles.courseHeaderUnique}>
                    <h1>{course.title}</h1>
                    <p>{course.description}</p>
                    <p>
                        Instructor:{" "}
                        <span
                            className={styles.instructorLink}
                            onClick={() => navigate(`/instructor-profile/${course.instructor?._id}`)}
                        >
                            {course.instructor?.username} (See More)
                        </span>
                    </p>
                    <p>Language: Hindi</p>
                </header>

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
                                        <li key={lessonIndex}>
                                            📘 {lesson.title} - <span>{lesson.duration}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.courseCardUnique}>
                <img
                    src={`http://localhost:5000/image/course-thumbnail/${course.courseImage}`}
                    alt={course.title}
                    className={styles.courseImageUnique}
                />
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

                {isEnrolled ? (
                    <button
                        className={styles.classroomBtnUnique}
                        onClick={() => navigate(`/classroom/${id}`)}
                    >
                        Go to Classroom
                    </button>
                ) : (
                    <button
                        className={styles.enrollBtnUnique}
                        onClick={() => createRazorpayOrder(course.price)}
                    >
                        Enroll Now
                    </button>
                )}

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
