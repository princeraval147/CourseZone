import { useEffect, useState } from "react";
// import useAuth from "./hooks/useAuth"; // Ensure this is correctly linked to your useAuth hook
import useAuth from '../Components/hooks/useAuth'
import Styles from '../Styles/Profile.module.css'

const Profile = () => {
    const isAuthenticated = useAuth(); // Get authentication status
    console.log(isAuthenticated);
    // // Ensure the component does not render until authentication is determined
    // if (isAuthenticated === null) return null; // Do not render anything

    // // If user is not authenticated, redirect to login (handled in useAuth)
    // if (!isAuthenticated) return null; 

    // States for profile data and editing
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

    // Fetch profile data when the component mounts
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

    // Handle profile update logic
    const handleUpdateProfile = async () => {
        const formData = new FormData();
        formData.append("username", profileData.username);
        formData.append("oldPassword", profileData.oldPassword);
        formData.append("newPassword", profileData.newPassword);
        if (profileData.profilePhoto) formData.append("profilePhoto", profileData.profilePhoto);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/update-profile`, {
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

    // Handle logout logic
    const handleLogout = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to logout");

            window.location.href = "/login";
        } catch (error) {
            setError(error.message);
        }
    };

    // Handle input changes for profile editing
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setProfileData((prevState) => ({
            ...prevState,
            [name]: name === "profilePhoto" ? files[0] : value,
        }));
    };

    // Render loading or error messages
    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>No profile data found.</p>;

    // Profile edit form and actions
    return (
        <div className={Styles.profileContainer}>
            <div className={`profileCard ${isEditing ? "expand" : ""}`}>
                <img
                    src={user.photoUrl || "https://via.placeholder.com/100"}
                    alt="Profile"
                    className={Styles.profileImage}
                />
                <div className={Styles.profileInfo}>
                    <h2>{user.username}</h2>
                    <p>{user.email}</p>
                    <p className="role">{user.role}</p>

                    {isEditing ? (
                        <div className={Styles.profileEditForm}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={profileData.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={formGroup}>
                                <label>Profile Photo</label>
                                <input
                                    type="file"
                                    name="profilePhoto"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={formGroup}>
                                <label>Old Password</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={profileData.oldPassword}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={formGroup}>
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={profileData.newPassword}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button onClick={handleUpdateProfile}>Save Changes</button>
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    ) : (
                        <div className={Styles.profileActions}>
                            <button className={Styles.ProfileBtn} onClick={() => setIsEditing(true)}>Update Profile</button>
                            <button className={Styles.ProfileBtn} onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
