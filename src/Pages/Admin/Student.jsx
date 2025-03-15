import React, { useEffect, useState } from "react";
import styles from "../../Styles/Student.module.css";

const Student = () => {

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/payment/enrolled-students",
                    { credentials: "include", });
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                setStudents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    return (
        <div className={styles.studentEnrolled}>
            <h2>Students Enrolled</h2>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && students.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Student Name</th>
                            <th>Course Title</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={student.id}>
                                <td>{index + 1}</td>
                                <td>{student.name}</td>
                                <td>{student.course}</td>
                                <td>{student.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !loading && <p>No students enrolled yet.</p>
            )}
        </div>
    );
};

export default Student;
