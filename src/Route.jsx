import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "./App";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Error from "./Components/Error";
import Register from "./Components/Register";
import ForgetPassword from "./Components/ForgetPassword";
import UpdateProfile from "./Components/UpdateProfile";
import VerifyOTP from "./Components/VerifyOTP";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route index element={<Home />} />
            <Route path='register' element={<Register />} />
            <Route path='login' element={<Login />} />
            <Route path='forgot-password' element={<ForgetPassword />} />
            <Route path='updateProfile' element={<UpdateProfile />} />
            <Route path='VerifyOTP' element={<VerifyOTP />} />
            <Route path='*' element={<Error />} />
        </Route>
    )
)

export default router;
