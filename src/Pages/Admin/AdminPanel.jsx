import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import style from '../../Styles/AdminPanel.module.css'
import AdminAuth from '../../Components/hooks/useAdminAuth'

const AdminPanel = () => {
    AdminAuth();
    return (
        <>
            <div className={style.adminPanel}>
                <Sidebar />
                <Outlet />
            </div>
        </>
    )
}

export default AdminPanel
