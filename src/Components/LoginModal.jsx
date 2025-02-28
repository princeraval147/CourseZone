import * as React from 'react';
import { Box, FormControl } from "@mui/material";
import { NavLink } from "react-router-dom";

const style = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    width: { xs: "90vw", sm: "70vw", md: "50vw", lg: "30vw" },
};

const LoginModal = (props) => {

    return (
        <Box sx={style}>
            <h4
                style={{
                    fontSize: "30px",
                    marginBottom: "24px",
                    textDecoration: "underline",
                }}
            >
                Login to Your Account
            </h4>
            <form>
                <FormControl sx={{ width: "100%" }}>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        className="inputText"
                        required
                    />
                </FormControl>
                <FormControl sx={{ width: "100%", mt: 2 }}>
                    <input
                        placeholder="Password"
                        type="password"
                        className="inputText"
                    />
                </FormControl>
                <div className="loginFp">
                    <button type="submit" className='Btn'>
                        Login
                    </button>
                    <NavLink to='/forgotPassword' className='link'>Forgot Password ?</NavLink>
                </div>
            </form>
            <br /><br />
            {/* <p>{message}</p> */}

            <div>
                <p style={{ color: "#333" }}>
                    By Continuing I accept the Privacy Policy, Terms & Conditions.
                </p>
            </div>
            <div>
                New to CourseZone? <NavLink to="/register" className='link'>Sign up</NavLink>
            </div>

        </Box >
    );
};

export default LoginModal;