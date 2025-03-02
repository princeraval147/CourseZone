import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'
import '../index.css';

const Header = () => {

    const [loginOpen, loginSetOpen] = React.useState(false);
    const handleOpen = () => loginSetOpen(true);
    const loginClose = () => loginSetOpen(false);

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
                        <NavLink to='/#About'>
                            About
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/contact'>
                            Contact Us
                        </NavLink>
                    </li>
                    {/* <li>
                        <NavLink to='/login'>
                            Login
                        </NavLink>
                    </li> */}
                    {/* <li>
                        <NavLink onClick={handleOpen}>
                            Login
                        </NavLink>
                        <Modal
                            open={loginOpen}
                            onClose={loginClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <LoginModal loginClose={loginClose} />
                        </Modal>
                    </li>
                    <li>
                        <NavLink to='/register'>
                            Register
                        </NavLink>
                    </li> */}
                </ul>
                <div>
                    <NavLink to='login' className='link'>
                        Login / Register
                    </NavLink>
                </div>
            </div>
        </>
    )
}

export default Header
