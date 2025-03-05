import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "./App";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Error from "./Pages/Error";
import Contact from "./Pages/Contact";
import Payment from "./Pages/Payment";
import AdminPanel from './Pages/Admin/AdminPanel'
import Dashboard from "./Pages/Admin/Dashboard";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route index element={<Home />} />
            <Route path='contact' element={<Contact />} />
            <Route path='login' element={<Login />} />
            <Route path='payment' element={<Payment />} />
            //Admin Panel
            <Route path="admin" element={<AdminPanel />} >
                <Route path='dashboard' element={<Dashboard />} />
            </Route>

            <Route path='*' element={<Error />} />
        </Route>
    )
)

export default router;
