import React from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => {
    return (
        <>
            <div className="header">
                <h3>Course Zone</h3>
                <ul className='headerLinks'>
                    <li>
                        <NavLink to='/'>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink>
                            About
                        </NavLink>
                    </li>
                    <li>
                        <NavLink>
                            Contact Us
                        </NavLink>
                    </li>
                    <li>
                        <NavLink>
                            Login
                        </NavLink>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Header
