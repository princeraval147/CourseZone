import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "./App";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Error from "./Pages/Error";
import Contact from "./Pages/Contact";
import CourseList from './Pages/CourseList'
import CourseDetails from './Pages/CourseDetails'
import Payment from "./Pages/Payment";
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

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route index element={<Home />} />
            <Route path='contact' element={<Contact />} />
            <Route path='login' element={<Login />} />
            <Route path='term-condition' element={<TermAndCondition />} />
            <Route path="course-list" element={<CourseList />} />
            <Route path="course-details/:id" element={<CourseDetails />} />
            <Route path='payment' element={<Payment />} />
            <Route path='profile' element={<Profile />} />
            <Route path='request-instructor' element={<RequestInstructor />} />
            <Route path="instructor-profile/:id" element={<InstructorProfile />} />
            <Route path='saved-courses' element={<SavedCourses />} />
            <Route path='my-courses' element={<MyEncrolledCourse />} />
            {/* <Route path='classroom' element={<Classroom />} /> */}
            <Route path="/classroom/:courseId" element={<Classroom />} />

            //Admin Panel
            <Route path="update-course/:id" element={<UpdateCourse />} />
            <Route path="admin" element={<AdminPanel />} >
                <Route path='dashboard' element={<Dashboard />} />
                <Route path="add-course" element={<AddCourse />} />
                <Route path="my-course" element={<MyCourses />} />
                <Route path="add-lecture" element={<AddLecture />} />
                <Route path="manage-lecture" element={<AdminManageLecture />} />
                <Route path="student" element={<Student />} />
            </Route>

            <Route path='*' element={<Error />} />
        </Route>
    )
)

export default router;
