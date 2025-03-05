import React from 'react'
import { NavLink } from 'react-router-dom'

const Error = () => {
    return (
        <>
            <div style={{
                height: "80vh",
                display: "flex",
                flexDirection: "column",
                gap: "50px",
                justifyContent: "center",
                alignItems: "center",
            }}>

                <h3
                    style={{

                        fontSize: "3rem"
                    }}
                >
                    404 ! Page Not Found
                </h3>
                <NavLink to='/' className='link'> Go to Home Page </NavLink>
            </div>
        </>
    )
}

export default Error
