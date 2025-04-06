import { useState } from "react";
import Swal from "sweetalert2";
import styles from "../Styles/RequestInstructor.module.css";
import useAuth from "../Components/hooks/useAuth";

const RequestInstructor = () => {
    const isAuthenticated = useAuth();
    const [message, setMessage] = useState("");
    const [cv, setCv] = useState(null);

    const handleFileChange = (e) => {
        setCv(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            Swal.fire({
                icon: "error",
                title: "Unauthorized",
                text: "You need to be logged in to send a request.",
            });
            return;
        }

        if (!cv) {
            Swal.fire({
                icon: "warning",
                title: "File Missing",
                text: "Please upload a CV (PDF, max 100KB).",
            });
            return;
        }

        const formData = new FormData();
        formData.append("cv", cv);
        formData.append("message", message);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/instructor/request`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Request Sent",
                    text: data.message,
                });
                setMessage("");
                setCv(null);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: "Something went wrong. Please try again later.",
            });
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <textarea
                className={styles.textarea}
                placeholder="Why do you want to be an instructor?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <input
                type="file"
                accept="application/pdf"
                className={styles.fileInput}
                onChange={handleFileChange}
            />
            <button className={styles.button} type="submit">Submit Request</button>
        </form>
    );
};

export default RequestInstructor;
