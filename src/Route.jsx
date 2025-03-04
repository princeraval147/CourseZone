import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "./App";
import Home from "./Components/Home";
import Login from "./Pages/Login";
import Error from "./Components/Error";
import Register from "./Components/Register";
import ForgetPassword from "./Components/ForgetPassword";
import VerifyOTP from "./Components/VerifyOTP";
import Dashboard from "./Pages/Admin/Dashboard";
import Contact from "./Pages/Contact";
import Payment from "./Pages/Payment";
// import Payment2 from "./Pages/Payment2";

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
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='*' element={<Error />} />
        </Route>
    )
)

export default router;
