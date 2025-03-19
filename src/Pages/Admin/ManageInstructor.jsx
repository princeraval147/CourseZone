import { useEffect, useState } from "react";
import styles from "../../styles/ManageInstructors.module.css"; // Import CSS module
import Swal from "sweetalert2";

const ManageInstructors = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/instructor/pending-instructors`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const data = await response.json();
            if (response.ok) {
                setPendingRequests(data.pendingRequests || []);
            } else {
                setMessage(data.message || "Error fetching data.");
            }
        } catch (error) {
            setMessage("Error fetching pending requests.");
        }
    };

    const handleApprove = async (requestId) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/instructor/approve/${requestId}`,
                {
                    method: "PUT",
                    credentials: "include",
                }
            );

            const data = await response.json();
            if (response.ok) {
                Swal.fire("Approved!", data.message, "success");
                fetchPendingRequests();
            } else {
                Swal.fire("Error!", data.message, "error");
            }
        } catch (error) {
            Swal.fire("Error!", "Something went wrong.", "error");
        }
    };


    const handleReject = async (requestId) => {

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/instructor/reject/${requestId}`,
                {
                    method: "PUT",
                    credentials: "include",
                }
            );

            const data = await response.json();
            if (response.ok) {
                Swal.fire("Rejected!", data.message, "info");
                fetchPendingRequests();
            } else {
                Swal.fire("Error!", data.message, "error");
            }
        } catch (error) {
            Swal.fire("Error!", "Something went wrong.", "error");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Manage Instructor Requests</h2>
            {message && <p className={styles.message}>{message}</p>}

            {Array.isArray(pendingRequests) && pendingRequests.length === 0 ? (
                <p className={styles.noRequests}>No pending instructor requests.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Requested Date</th>
                            <th>CV</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingRequests?.map((user) => (
                            <tr key={user._id}>
                                <td>{user.user.username}</td>
                                <td>{user.user.email}</td>
                                <td>{new Date(user.createdAt).toLocaleDateString("en-GB")}</td>
                                <td>
                                    <a
                                        href={`https://docs.google.com/gview?url=${encodeURIComponent(
                                            user.cvUrl
                                        )}&embedded=true`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View CV
                                    </a>
                                </td>

                                <td>{user.message}</td>
                                <td>{user.status}</td>
                                <td>
                                    <button
                                        onClick={() => handleApprove(user.user._id)}
                                        className={styles.approveButton}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(user.user._id)}
                                        className={styles.rejectButton}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ManageInstructors;
