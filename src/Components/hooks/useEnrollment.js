import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const useEnrollment = () => {
  const [isEnrolled, setIsEnrolled] = useState(null);
  const [isInstructor, setIsInstructor] = useState(false);
  const navigate = useNavigate();
  const { courseId, id } = useParams();

  const courseIdToUse = courseId || id;

  useEffect(() => {
    const checkEnrollmentAndInstructor = async () => {
      if (!courseIdToUse) {
        setIsEnrolled(false);
        navigate(-1);
        return;
      }

      try {

        const enrollmentResponse = await fetch(`${import.meta.env.VITE_API_URL}/courses/is-enrolled/${courseIdToUse}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const enrollmentData = await enrollmentResponse.json();


        if (enrollmentData.success && enrollmentData.isEnrolled) {
          setIsEnrolled(true);
        } else {

          const instructorResponse = await fetch(`${import.meta.env.VITE_API_URL}/courses/confirminstructor/${courseIdToUse}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          const instructorData = await instructorResponse.json();


          if (instructorData.success && instructorData.message === "You are the instructor of this course") {
            setIsInstructor(true);
            setIsEnrolled(true);
          } else {
            setIsEnrolled(false);
            navigate(-1);
          }
        }
      } catch (error) {
        console.error("Error checking enrollment or instructor status:", error);
        setIsEnrolled(false);
        navigate(-1);
      }
    };

    checkEnrollmentAndInstructor();
  }, [courseIdToUse, navigate]);

  return { isEnrolled, isInstructor };
};

export default useEnrollment;