import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const useEnrollment = () => {
  const [isEnrolled, setIsEnrolled] = useState(null);
  const navigate = useNavigate();
  
  const { courseId } = useParams(); 

  const id = courseId;
  
  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/is-enrolled/${id}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (data.success && data.isEnrolled) {
          setIsEnrolled(true);
        } else {
          setIsEnrolled(false);
          navigate(-1); // Redirect back to the previous page
        }
      } catch (error) {
        console.error("Error checking enrollment:", error);
        setIsEnrolled(false);
        navigate(-1); // Redirect back if there's an error
      }
    };

    checkEnrollment();
  }, [id, navigate]);

  return isEnrolled;
};

export default useEnrollment;
