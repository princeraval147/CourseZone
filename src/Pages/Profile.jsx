import { useEffect, useState } from "react";
import useAuth from '../Components/hooks/useAuth'
import styles from "../styles/Profile.module.css";
import { Avatar } from "@mui/material";

const Profile = () => {
    const isAuthenticated = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        username: "",
        profilePhoto: null,
        oldPassword: "",
        newPassword: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
                    credentials: "include",
                });

                if (!response.ok) throw new Error("Failed to fetch profile");

                const data = await response.json();
                setUser(data);
                setProfileData({
                    username: data.username,
                    profilePhoto: null,
                    oldPassword: "",
                    newPassword: "",
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleUpdateProfile = async () => {
        const formData = new FormData();
        formData.append("username", profileData.username);
        formData.append("oldPassword", profileData.oldPassword);
        formData.append("newPassword", profileData.newPassword);
        if (profileData.profilePhoto) formData.append("profilePhoto", profileData.profilePhoto);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/update-profile`, {
                method: "PUT",
                body: formData,
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to update profile");

            const data = await response.json();
            setUser(data.user);
            setIsEditing(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to logout");

            window.location.href = "/login";
        } catch (error) {
            setError(error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setProfileData((prevState) => ({
            ...prevState,
            [name]: name === "profilePhoto" ? files[0] : value,
        }));
    };

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>No profile data found.</p>;

    return (
        <>

            <div className={styles.profileContainer}>
                <div className={`${styles.profileCard} ${isEditing ? styles.expand : ""}`}>
                    {/* <img
                        src={user.photoUrl || <Avatar sx={{ width: 30, height: 30 }}></Avatar>}
                        alt="Profile Image"
                        className={styles.profileImage}
                    /> */}
                    <div className={styles.profileInfo}>
                        {user.photoUrl ? (
                            <img
                                src={user.photoUrl}
                                alt="Profile Image"
                                className={styles.profileImage}
                            />
                        ) : (
                            <>
                                <div style={{ display: "flex", gap: "10px" }}>

                                    <Avatar sx={{ width: 30, height: 30 }} >

                                    </Avatar>
                                    <h2>{user.username}</h2>
                                </div>
                            </>

                        )}
                        {/* <h2>{user.username}</h2> */}
                        <p>{user.email}</p>
                        <p className={styles.role}>{user.role}</p>

                        {isEditing ? (
                            <div className={styles.profileEditForm}>
                                <div className={styles.formGroup}>
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={profileData.username}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Profile Photo</label>
                                    <input
                                        type="file"
                                        name="profilePhoto"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Old Password</label>
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        value={profileData.oldPassword}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={profileData.newPassword}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={styles.profileActions}>
                                    <button onClick={handleUpdateProfile}>Save Changes</button>
                                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.profileActions}>
                                <button onClick={() => setIsEditing(true)}>Update Profile</button>
                                {/* <button onClick={handleLogout}>Logout</button> */}
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </>
    );
};

export default Profile;