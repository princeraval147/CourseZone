import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './Components/Home.jsx'
import Error from './Components/Error.jsx'
import Login from './Components/Login.jsx'
import ForgetPassword from './Components/ForgetPassword.jsx'
import Register from './Components/Register.jsx'
import UpdateProfile from './Components/UpdateProfile.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/forgot-password' element={<ForgetPassword />} />
      <Route path='/updateProfile' element={<UpdateProfile />} />
      <Route path='*' element={<Error />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </StrictMode>,
)
