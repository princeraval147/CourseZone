import React from "react";
// import styles from "../../styles/StudentEnrolled.module.css";

const students = [
    { id: 1, name: "Richard", course: "React JS", date: "22 Aug, 2024" },
    { id: 2, name: "Alison", course: "Full Stack", date: "15 Oct, 2024" },
];

const Student = () => {
    return (
        // <div className={styles.studentEnrolled}>
        <div>
            <h2>Student Enrolled</h2>
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
        </div>
    );
};

export default Student;
