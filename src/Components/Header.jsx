import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'
import '../index.css';
import {
    Box,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
    IconButton,
    Tooltip,
} from "@mui/material";
import { IoMdSettings } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { IoPersonAdd } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Header.module.css";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // For Profile Drop Down
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // useEffect(() => {
    const checkLoginStatus = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/isloggedin`, {
                credentials: "include",
            });

            if (res.ok) {
                setIsLoggedIn(true);
                const roleRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                    credentials: "include",
                });
                const role = await roleRes.json();
                setUserRole(role);
            } else {
                setIsLoggedIn(false);
                setUserRole(null);
            }
        } catch (error) {
            console.error("Error checking login status:", error);
        }
    };
    checkLoginStatus();
    // }, []);

    const handlerLogout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
            setIsLoggedIn(false);
            setUserRole(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // For Profile Pic
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
                    credentials: "include",
                });

                if (!response.ok) throw new Error("Failed to fetch profile");
                const data = await response.json();
                setUser(data || {});
                setFormData((prev) => ({ ...prev, username: data.username }));
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    return (
        <>
            <div className={styles.header}>
                {/* <h3>Course Zone</h3> */}
                <NavLink to='/'>
                    <img
                        src="/Img/CourseZone.png"
                        alt="CourseZone Logo"
                        height={75}
                        width={85}
                    />
                </NavLink>
                <ul className={styles.headerLinks}>
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
                    <li>
                        {
                            userRole === "instructor" &&
                            <NavLink to="/admin">
                                Dashboard
                            </NavLink>
                        }
                    </li>
                </ul>
                <div>
                    {
                        isLoggedIn ? (
                            <>
                                <div>
                                    <div className="profile">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                textAlign: "center",
                                            }}
                                        >
                                            <Tooltip title="Account settings">
                                                <IconButton
                                                    onClick={handleClick}
                                                    size="small"
                                                    sx={{ padding: "8px", gap: "10px", }}
                                                    aria-controls={open ? "account-menu" : undefined}
                                                    aria-haspopup="true"
                                                    aria-expanded={open ? "true" : undefined}
                                                >
                                                    {
                                                        !user ? <Avatar></Avatar>
                                                            :
                                                            <Avatar
                                                                sx={{ width: 30, height: 30 }}
                                                                src={user.photoUrl}
                                                            >
                                                            </Avatar>
                                                    }
                                                    <span className="HelloUser">Hello, {userRole}</span>
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <Menu
                                            anchorEl={anchorEl}
                                            id="account-menu"
                                            open={open}
                                            onClose={handleClose}
                                            onClick={handleClose}
                                            slotProps={{
                                                paper: {
                                                    elevation: 0,
                                                    sx: {
                                                        overflow: "visible",
                                                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                                        mt: 1.5,
                                                        "& .MuiAvatar-root": {
                                                            width: 32,
                                                            height: 32,
                                                            ml: -0.5,
                                                            mr: 1,
                                                        },
                                                        "&::before": {
                                                            content: '""',
                                                            display: "block",
                                                            position: "absolute",
                                                            top: 0,
                                                            right: 14,
                                                            width: 10,
                                                            height: 10,
                                                            bgcolor: "background.paper",
                                                            transform: "translateY(-50%) rotate(45deg)",
                                                            zIndex: 0,
                                                        },
                                                    },
                                                },
                                            }}
                                            transformOrigin={{ horizontal: "right", vertical: "top" }}
                                            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                                        >
                                            <NavLink to='/profile' style={{ color: "#212121" }}>
                                                <MenuItem onClick={handleClose}>
                                                    <Avatar />
                                                    Profile
                                                </MenuItem>
                                            </NavLink>

                                            <NavLink to="/saved-courses" style={{ color: "#212121" }}>
                                                <MenuItem onClick={handleClose} sx={{ display: "flex", gap: "10px", padding: "10px 10px" }} >
                                                    <IoBookmarkOutline size={30} />
                                                    Saved
                                                </MenuItem>
                                            </NavLink>

                                            <Divider />

                                            <MenuItem onClick={handleClose}>
                                                <ListItemIcon>
                                                    <IoPersonAdd />
                                                </ListItemIcon>
                                                <NavLink to="/signUp" style={{ color: "#212121" }}>
                                                    Add another account
                                                </NavLink>
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                <ListItemIcon>
                                                    <IoMdSettings size={24} />
                                                </ListItemIcon>
                                                <NavLink to="#" style={{ color: "#212121" }}>
                                                    Settings
                                                </NavLink>
                                            </MenuItem>
                                            <MenuItem onClick={handlerLogout}>
                                                <ListItemIcon>
                                                    <MdLogout size={24} />
                                                </ListItemIcon>
                                                Logout
                                            </MenuItem>
                                        </Menu>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <NavLink to='login' className='link'>
                                Login / Register
                            </NavLink>
                        )
                    }

                </div>
            </div>
        </>
    )
}

export default Header
