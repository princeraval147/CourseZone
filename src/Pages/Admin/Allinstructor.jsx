import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "../../styles/AllInstructor.module.css";

const AllInstructors = () => {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/auth/instructors", {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch instructors");
                }
                const data = await response.json();
                setInstructors(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchInstructors();
    }, []);

    const handleRoleChange = async (id, action) => {
        const endpoint = action === "promote" ? "promote" : "demote";
        try {
            const response = await fetch(`http://localhost:5000/api/auth/instructors/${id}/${endpoint}`, {
                method: "PUT",
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to update role");
            }
            setInstructors((prev) =>
                prev.map((instructor) =>
                    instructor._id === id
                        ? { ...instructor, role: action === "promote" ? "admin" : "student" }
                        : instructor
                )
            );

            Swal.fire({
                icon: "success",
                title: `${action === "promote" ? "Promoted" : "Demoted"} Successfully`,
                text: `Instructor role changed to ${action === "promote" ? "Admin" : "Student"}`,
            });
        } catch (err) {
            console.error("Error updating role:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to update instructor role",
            });
        }
    };

    if (loading) return <p className={styles.loadingMessage}>Loading instructors...</p>;
    if (error) return <p className={styles.errorMessage}>Error: {error}</p>;

    return (
        <div className={styles.allInstructorsContainer}>
            <h2 className={styles.instructorsHeader}>All Instructors</h2>
            <table className={styles.instructorsTable}>
                <thead className={styles.instructorsTableHeader}>
                    <tr>
                        <th className={styles.instructorsTableCell}>Username</th>
                        <th className={styles.instructorsTableCell}>Email</th>
                        <th className={styles.instructorsTableCell}>Profile</th>
                        <th className={styles.instructorsTableCell}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {instructors.map((instructor) => (
                        <tr key={instructor._id} className={styles.instructorsTableRow}>
                            <td className={styles.instructorsTableCell}>{instructor.username}</td>
                            <td className={styles.instructorsTableCell}>{instructor.email}</td>
                            <td className={styles.instructorsTableCell}>
                                <button
                                    className={`${styles.button} ${styles.viewProfileButton}`}
                                    onClick={() => navigate(`/instructor-profile/${instructor._id}`)}
                                >
                                    View Profile
                                </button>
                            </td>
                            <td className={styles.instructorsTableCell}>
                                <div className={styles.actionButtonsContainer}>
                                    <button
                                        className={`${styles.button} ${styles.promoteButton}`}
                                        onClick={() => handleRoleChange(instructor._id, "promote")}
                                    >
                                        Promote to Admin
                                    </button>
                                    <button
                                        className={`${styles.button} ${styles.demoteButton}`}
                                        onClick={() => handleRoleChange(instructor._id, "demote")}
                                    >
                                        Demote to Student
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllInstructors;



// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2"; // Import SweetAlert2
// import styles from "../../styles/AllInstructor.module.css";

// const AllInstructors = () => {
//     const [instructors, setInstructors] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     // Fetch instructors when component mounts
//     useEffect(() => {
//         const fetchInstructors = async () => {
//             try {
//                 const response = await fetch("http://localhost:5000/api/auth/instructors", {
//                     credentials: "include",
//                 });
//                 if (!response.ok) {
//                     throw new Error("Failed to fetch instructors");
//                 }
//                 const data = await response.json();
//                 setInstructors(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInstructors();
//     }, []);

//     // Handle promote/demote actions
//     const handleRoleChange = async (id, action) => {
//         const endpoint = action === "promote" ? "promote" : "demote";
//         try {
//             const response = await fetch(`http://localhost:5000/api/auth/instructors/${id}/${endpoint}`, {
//                 method: "PUT",
//                 credentials: "include",
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to update role");
//             }

//             // Refresh instructor list
//             setInstructors((prev) =>
//                 prev.map((instructor) =>
//                     instructor._id === id
//                         ? { ...instructor, role: action === "promote" ? "admin" : "student" }
//                         : instructor
//                 )
//             );

//             // Show SweetAlert success message
//             Swal.fire({
//                 icon: "success",
//                 title: `${action === "promote" ? "Promoted" : "Demoted"} Successfully`,
//                 text: `Instructor role changed to ${action === "promote" ? "Admin" : "Student"}`,
//             });
//         } catch (err) {
//             console.error("Error updating role:", err);
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: "Failed to update instructor role",
//             });
//         }
//     };

//     if (loading) return <p>Loading instructors...</p>;
//     if (error) return <p>Error: {error}</p>;

//     return (
//         <div>
//             <h2>All Instructors</h2>
//             <table border="1" cellPadding="10" style={{ width: "100%" }}>
//                 <thead>
//                     <tr>
//                         <th>Username</th>
//                         <th>Email</th>
//                         <th>Profile</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {instructors.map((instructor) => (
//                         <tr key={instructor._id}>
//                             <td>{instructor.username}</td>
//                             <td>{instructor.email}</td>
//                             <td>
//                                 <button onClick={() => navigate(`/instructor-profile/${instructor._id}`)}>
//                                     View Profile
//                                 </button>
//                             </td>
//                             <td>
//                                 <button onClick={() => handleRoleChange(instructor._id, "promote")}>
//                                     Promote to Admin
//                                 </button>
//                                 <button onClick={() => handleRoleChange(instructor._id, "demote")}>
//                                     Demote to Student
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default AllInstructors;
