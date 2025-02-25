import * as React from 'react';
import { Box, FormControl, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";

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
    const { handleClose } = props;
    const navigate = useNavigate();

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
                        className="inputFeild"
                        required
                    />
                </FormControl>
                <FormControl sx={{ width: "100%", mt: 2 }}>
                    <input
                        placeholder="Password"
                        type="password"
                        className="inputFeild"
                    />
                </FormControl>
                <button type="submit" color="primary" className="Btn">
                    Login
                </button>
            </form>
            <Typography variant="body2" sx={{ mt: 2 }}>
                <p style={{ color: "#333" }}>
                    By Continuing I accept the Privacy Policy, Terms & Conditions.
                </p>
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
                Don't have an account? <NavLink to="/">Sign up</NavLink>
            </Typography>
        </Box>
    );
};

export default LoginModal;