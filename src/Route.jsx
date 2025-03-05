import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "./App";
import Home from "./Components/Home";
import Login from "./Pages/Login";
import Error from "./Components/Error";
import Register from "./Components/Register";
import ForgetPassword from "./Components/ForgetPassword";
import VerifyOTP from "./Components/VerifyOTP";
import Contact from "./Pages/Contact";
import Payment from "./Pages/Payment";
import AdminPanel from './Pages/Admin/AdminPanel'
import Dashboard from "./Pages/Admin/Dashboard";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route index element={<Home />} />
            <Route path='register' element={<Register />} />
            <Route path='login' element={<Login />} />
            <Route path='payment' element={<Payment />} />
            <Route path='forgotPassword' element={<ForgetPassword />} />
            <Route path='contact' element={<Contact />} />
            <Route path='VerifyOTP' element={<VerifyOTP />} />
            //Admin Panel
            <Route path="admin" element={<AdminPanel />} >
                <Route path='dashboard' element={<Dashboard />} />
            </Route>

            <Route path='*' element={<Error />} />
        </Route>
    )
)

export default router;
