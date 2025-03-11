import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import styles from "../styles/CourseDetails.module.css";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const CourseDetails = () => {

    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [openSections, setOpenSections] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };
    if (!course) return <p>Loading...</p>;

    //          Payment Method
    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }
            document.body.appendChild(script);
        })
    }

    const handleRazorpayScreen = async (orderData) => {
        setIsLoading(true);
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
        if (!res) {
            alert("Some Error at razorpay Screen Loading")
            return;
        }
        const options = {
            key: "rzp_test_wwpkm13Z4MY1Dv",
            amount: orderData.amount,
            currency: "INR",
            name: "Course Zone",
            description: "Payment to Couese Zone",
            image: null,
            handler: function (response) {
                setResponseId(response.razorpay_payment_id)
            },
            profill: {
                name: "Course Zone",
                email: "coursezonebusiness@gmail.com"
            },
            theme: {
                color: "#F4C430"
            }
        }
        const paymentObject = new window.Razorpay(options);
        // Optionally, add an event listener for payment failures
        paymentObject.on("payment.failed", function (response) {
            console.error("Payment failed:", response.error);
            alert("Payment failed. Please try again.");
        });
        paymentObject.open();
        setIsLoading(false);
    }

    const createRazorpayOrder = async (payableAmount) => {
        setIsLoading(true);
        let data = JSON.stringify({
            amount: payableAmount * 100,
            currency: "INR"
        })
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "http://localhost:5000/orders",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }
        const response = await axios.request(config);
        console.log("Order Data:", response.data);

        // Call function to open Razorpay checkout popup with order details
        await handleRazorpayScreen(response.data);
        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data))
            })
            .catch((error) => {
                console.log("Error at", error)
            })
        setIsLoading(false);
    }

    const coursePrice = course.price;

    return (
        <div className={styles.courseDetailsContainerUnique}>
            {isLoading && (
                <div className={styles.loadingOverlay}>
                    <CircularProgress size={60} color="primary" />
                    <p className={styles.loadingText}>Processing Payment...</p>
                </div>
            )}
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
                    {/* <span className={styles.oldPriceUnique}>₹{course.oldPrice}</span> */}
                    {/* <span className={styles.discountUnique}>
                        {Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100)}% off
                    </span> */}
                </div>
                {/* {isLoading ? (
                    <CircularProgress color="primary" />
                ) : (
                    <button className={styles.enrollBtnUnique} onClick={() => createRazorpayOrder(course.price)}>
                        Enroll Now
                    </button>
                )} */}
                <button
                    className={styles.enrollBtnUnique}
                    onClick={() => createRazorpayOrder(coursePrice)}
                >
                    Enroll Now
                </button>
                <br /><br />
                {/* <h4>What's in the course?</h4> */}
                <p className={styles.termCondition}>
                    <input type="checkbox" name="checkBox" id="checkBox" />
                    <label htmlFor="checkBox">
                        By Confirm you are agree with our <NavLink to='/term-condition'>Term And Condition</NavLink>
                    </label>
                </p>
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
