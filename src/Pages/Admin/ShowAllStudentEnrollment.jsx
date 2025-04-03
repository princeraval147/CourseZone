import React, { useEffect, useState } from "react";
import styles from "../../styles/StudentEnrolled.module.css";

const ShowAllStudentEnrollment = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses", { credentials: "include" });
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data.courses);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCourses();
  }, []);



  const fetchStudents = async (courseId) => {
    setLoading(true);
    setStudents([]);
    try {
      const response = await fetch(`http://localhost:5000/api/payment/enrolled-students?courseId=${courseId}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle course selection change
  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    if (courseId) {
      fetchStudents(courseId);
    } else {
      setStudents([]);
    }
  };

  return (
    <div className={styles.studentEnrolled}>
      <h2>Students Enrolled</h2>

      {/* Course dropdown */}
      <div className={styles.courseDropdown}>
        <label htmlFor="course-select">Select Course:</label>
        <select id="course-select" value={selectedCourse} onChange={handleCourseChange}>
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* If students are available, display them in a table */}
      {!loading && !error && students.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Razorpay Order ID</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.razorpayOrderId}</td>
                <td>{new Date(student.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (

        !loading && selectedCourse && <p>No students enrolled yet.</p>
      )}
    </div>
  );
};

export default ShowAllStudentEnrollment;
