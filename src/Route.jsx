import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "./App";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Error from "./Pages/Error";
import Contact from "./Pages/Contact";
import CourseList from './Pages/CourseList'
import CourseDetails from './Pages/CourseDetails'
import AdminPanel from './Pages/Admin/AdminPanel'
import Dashboard from "./Pages/Admin/Dashboard";
import AddCourse from "./Pages/Admin/AddCourse";
import UpdateCourse from './Pages/Admin/UpdateCourse'
import MyCourses from "./Pages/Admin/MyCourse";
import Student from "./Pages/Admin/Student";
import AddLecture from "./Pages/Admin/AddLecture";
import AdminManageLecture from "./Pages/Admin/AdminManageLecture";
import TermAndCondition from "./Pages/TermAndCondition";
import Profile from "./Pages/Profile";
import SavedCourses from "./Pages/SavedCourses";
import MyEncrolledCourse from "./Pages/MyEncrolledCourse";
import RequestInstructor from "./Pages/RequestInstructor";
import InstructorProfile from "./Pages/InstructorProfile";
import Classroom from "./Pages/Classroom";
import ChatRoom from "./Pages/ChatRoom";
import ManageInstructors from "./Pages/Admin/ManageInstructor";
import ShowAllInstructorCourse from "./Pages/Admin/ShowAllInstructorCourse";
import ShowAllStudentEnrollment from "./Pages/Admin/ShowAllStudentEnrollment";
import ShowAllCourseReview from "./Pages/Admin/ShowAllCourseReview";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route index element={<Home />} />
            <Route path='contact' element={<Contact />} />
            <Route path='login' element={<Login />} />
            <Route path='term-condition' element={<TermAndCondition />} />
            <Route path="course-list" element={<CourseList />} />
            <Route path="course-details/:id" element={<CourseDetails />} />
            <Route path='profile' element={<Profile />} />
            <Route path='request-instructor' element={<RequestInstructor />} />
            <Route path="instructor-profile/:id" element={<InstructorProfile />} />
            <Route path='saved-courses' element={<SavedCourses />} />
            <Route path='my-courses' element={<MyEncrolledCourse />} />
            {/* <Route path='classroom' element={<Classroom />} /> */}
            <Route path="/classroom/:courseId" element={<Classroom />} />
            <Route path="/chat-room/:id" element={<ChatRoom />} />
            //Admin Panel
            <Route path="update-course/:id" element={<UpdateCourse />} />
            <Route path="admin" element={<AdminPanel />} >
                <Route path='dashboard' element={<Dashboard />} />
                <Route path="add-course" element={<AddCourse />} />
                <Route path="my-course" element={<MyCourses />} />
                <Route path="add-lecture" element={<AddLecture />} />
                <Route path="manage-lecture" element={<AdminManageLecture />} />
                <Route path="manage-instructor" element={<ManageInstructors />} />
                <Route path="student" element={<Student />} />
                {/* For Admin */}
                <Route path="show-all-course" element={<ShowAllInstructorCourse />} />
                <Route path="show-all-student" element={<ShowAllStudentEnrollment />} />
                <Route path="show-all-review" element={<ShowAllCourseReview />} />
                <Route path="show-all-instructors" element={<ShowAllInstructorCourse />} />
            </Route>

            <Route path='*' element={<Error />} />
        </Route>
    )
)

export default router;
