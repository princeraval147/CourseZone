import { useEffect, useState } from "react";
import { z } from "zod";
import useAuth from "../Components/hooks/useAuth";
import styles from "../styles/Profile.module.css";
import { Avatar } from "@mui/material";
import { NavLink } from "react-router-dom";

const profileSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    oldPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must include an uppercase letter")
        .regex(/[a-z]/, "Must include a lowercase letter")
        .regex(/[0-9]/, "Must include a digit")
        .regex(/[\W_]/, "Must include a special character")
        .optional()
        .or(z.literal("")),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must include an uppercase letter")
        .regex(/[a-z]/, "Must include a lowercase letter")
        .regex(/[0-9]/, "Must include a digit")
        .regex(/[\W_]/, "Must include a special character")
        .optional()
        .or(z.literal("")),
}).refine((data) => {
    if (data.newPassword && !data.oldPassword) {
        return false;
    }
    return true;
}, { message: "Old password is required when changing password", path: ["oldPassword"] });


const Profile = () => {
    const isAuthenticated = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);


    const [formData, setFormData] = useState({
        username: "",
        oldPassword: "",
        newPassword: "",
        profilePhoto: null,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
                    credentials: "include",
                });

                if (!response.ok) throw new Error("Failed to fetch profile");

                const data = await response.json();
                setUser(data);
                setFormData((prev) => ({ ...prev, username: data.username }));
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const validateForm = () => {
        try {
            profileSchema.parse(formData);
            setErrors({});
            return true;
        } catch (validationError) {
            const formattedErrors = {};
            validationError.errors.forEach((err) => {
                formattedErrors[err.path[0]] = err.message;
            });
            setErrors(formattedErrors);
            return false;
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const form = new FormData();
        form.append("username", formData.username);
        form.append("oldPassword", formData.oldPassword);
        form.append("newPassword", formData.newPassword);
        if (formData.profilePhoto) form.append("profilePhoto", formData.profilePhoto);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/update-profile`, {
                method: "PUT",
                body: form,
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to logout");

            window.location.href = "/login";
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>No profile data found.</p>;

    const totalCourses = user.savedCourses.length;

    return (
        <div className={styles.profileContainer}>
            <div className={`${styles.profileCard} ${isEditing ? styles.expand : ""}`}>
                {/* {user.photoUrl ? (
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

                )} */}
                {user?.photoUrl ? (
                    <img
                        src={user.photoUrl}
                        alt="Profile"
                        className={styles.profileImage}
                    />
                ) : (
                    <>
                        <div className={styles.avatarContainer}>
                            <Avatar />
                        </div>
                    </>
                )}

                {/* <img
                    src={user.photoUrl || <Avatar></Avatar>}
                    alt="Profile"
                    className={styles.profileImage}
                /> */}
                <div className={styles.profileInfo}>
                    <div className={styles.userInfo}>
                        <h2>{user.username}</h2>
                        <p>{user.email}</p>
                        <p className={styles.role}>
                            <span className={styles.label}>Role : </span>
                            {user.role}
                        </p>
                        <NavLink to='/saved-courses' className='link'>Total Saved Coursee : {totalCourses}</NavLink>
                    </div>

                    {isEditing ? (
                        <form className={styles.profileEditForm} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>Username</label>
                                <input type="text" name="username" value={formData.username} onChange={handleChange} />
                                {errors.username && <p className={styles.error}>{errors.username}</p>}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Profile Photo</label>
                                <input type="file" name="profilePhoto" onChange={handleChange} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Old Password</label>
                                <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} />
                                {errors.oldPassword && <p className={styles.error}>{errors.oldPassword}</p>}
                            </div>

                            <div className={styles.formGroup}>
                                <label>New Password</label>
                                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
                                {errors.newPassword && <p className={styles.error}>{errors.newPassword}</p>}
                            </div>

                            <div className={styles.updateBtns}>
                                <button className={styles.primaryButton} type="submit">
                                    Save Changes
                                </button>
                                <button className={styles.secondaryButton} type="button" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className={styles.profileActions}>
                            <button className={styles.primaryButton} onClick={() => setIsEditing(true)}>
                                Update Profile
                            </button>
                            <button className={styles.dangerButton} onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default Profile;