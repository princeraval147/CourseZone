import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import style from '../../Styles/AdminPanel.module.css'

const AdminPanel = () => {
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
