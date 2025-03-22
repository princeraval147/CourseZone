import { useState } from "react";
import styles from "../Styles/Login.module.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [activeTab, setActiveTab] = useState("signup");
    const [step, setStep] = useState(1); // 1 -> Login/Register, 2 -> Verify OTP
    const [resetStep, setResetStep] = useState(0); // 0 -> Normal Login, 1 -> Enter Email, 2 -> Enter OTP & New Password
    const Navigate = useNavigate();

    // Signup & Login State
    const [signupData, setSignupData] = useState({
        username: "",
        email: "",
        password: "",
        otp: ["", "", "", "", "", ""],
    });

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [resetData, setResetData] = useState({
        email: "",
        otp: ["", "", "", "", "", ""],  // 🆕 Store OTP as an array
        newPassword: "",
    });

    const [message, setMessage] = useState("");

    // Handle input change
    const handleChange = (e, setState) => {
        setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // ------------------------------------------------------------------------------------------
    // const handleOtpChange = (e, index) => {
    //     let { value } = e.target;
    //     if (/^\d?$/.test(value)) {  // Allow only numbers
    //         let newOtp = [...resetData.otp];
    //         newOtp[index] = value;
    //         setResetData({ ...resetData, otp: newOtp });
    //         // Move to next box
    //         if (value && index < 5) {
    //             document.getElementById(`otp-${index + 1}`).focus();
    //         }
    //     }
    // };
    const handleOtpChange = (e, index) => {
        let { value } = e.target;
        if (/^\d?$/.test(value)) {  // Allow only single-digit numbers
            setResetData((prev) => {
                let newOtp = [...prev.otp];
                newOtp[index] = value;
                return { ...prev, otp: newOtp };
            });
            // Move to the next box if typing
            if (value && index < 5) {
                setTimeout(() => document.getElementById(`otp-${index + 1}`).focus(), 50);
            }
        }
    };
    const handleOtpVerify = (e, index) => {
        let { value } = e.target;
        if (/^\d?$/.test(value)) {  // Allow only single-digit numbers
            setSignupData((prev) => {
                let newOtp = [...prev.otp];
                newOtp[index] = value;
                return { ...prev, otp: newOtp };
            });
            // Move to the next box if typing
            if (value && index < 5) {
                setTimeout(() => document.getElementById(`otp-${index + 1}`).focus(), 50);
            }
        }
    };
    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !resetData.otp[index]) {
            if (index > 0) {
                document.getElementById(`otp-${index - 1}`).focus();
            }
        }
    };
    // const handleOtpKeyDown = (e, index) => {
    //     if (e.key === "Backspace" && !resetData.otp[index]) {
    //         if (index > 0) {
    //             document.getElementById(`otp-${index - 1}`).focus();
    //         }
    //     }
    // };
    // ------------------------------------------------------------------------------------------



    // Handle Signup Submission
    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        if (step === 1) {
            // Register Request
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signupData),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Registration successful! Check your email for OTP.");
                setStep(2); // Move to OTP verification
            } else {
                setMessage(data.message);
            }
        } else {
            // Verify OTP Request
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // body: JSON.stringify({ email: signupData.email, otp: signupData.otp }),
                body: JSON.stringify({ email: signupData.email, otp: signupData.otp.join("") }),
            });

            const data = await response.json();
            setMessage(data.message);
            if (response.ok) setStep(3); // OTP verified, registration complete
        }
    };

    // Handle Login Submission
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Important for setting cookies
                body: JSON.stringify(loginData),
            });

            const data = await response.json();
            setMessage(data.message);

            if (response.ok) {
                document.cookie = `token=${data.token}; path=/;`;
                Navigate('/');
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        }
    };

    // Handle Forgot Password Steps
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setMessage("");

        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({ email: resetData.email }),
            body: JSON.stringify({ email: resetData.email, otp: parseInt(resetData.otp.join(""), 10), newPassword: resetData.newPassword }),
        });

        const data = await response.json();
        setMessage(data.message);

        if (response.ok) setResetStep(2); // Move to OTP & New Password Form
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage("");

        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify(resetData),
            body: JSON.stringify({ email: resetData.email, otp: parseInt(resetData.otp.join(""), 10), newPassword: resetData.newPassword }),

        });

        const data = await response.json();
        setMessage(data.message);

        if (response.ok) {
            setResetStep(0);
            setActiveTab("login");
        }
    };

    return (
        <div className={styles.logincontainer}>
            <div className={styles.formBox}>
                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={activeTab === "signup" ? styles.active : ""}
                        onClick={() => {
                            setActiveTab("signup");
                            setResetStep(0);
                        }}
                    >
                        Signup
                    </button>
                    <button
                        className={activeTab === "login" ? styles.active : ""}
                        onClick={() => {
                            setActiveTab("login");
                            setResetStep(0);
                        }}
                    >
                        Login
                    </button>
                </div>

                {/* Signup Form */}
                {activeTab === "signup" && step === 1 && (
                    <form onSubmit={handleSignupSubmit} className={styles.form}>
                        <h2>Signup</h2>
                        <p>Create an account to get started.</p>

                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={signupData.username}
                            onChange={(e) => handleChange(e, setSignupData)}
                            className="inputText"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={signupData.email}
                            onChange={(e) => handleChange(e, setSignupData)}
                            className="inputText"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={signupData.password}
                            onChange={(e) => handleChange(e, setSignupData)}
                            className="inputText"
                            required
                        />
                        <button type="submit">Register</button>
                    </form>
                )}

                {/* OTP Verification Form */}
                {activeTab === "signup" && step === 2 && (
                    <form onSubmit={handleSignupSubmit} className={styles.form}>
                        <h2>Verify OTP</h2>
                        <p>Enter the 6-digit OTP sent to your email.</p>

                        {/* <input
                            type="text"
                            name="otp"
                            placeholder="Enter 6-digit OTP"
                            value={signupData.otp}
                            onChange={(e) => handleChange(e, setSignupData)}
                            className="inputText"
                            required
                        /> */}
                        <div className="otpContainer">
                            {signupData.otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpVerify(e, index)}
                                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                    className="otpBox"
                                    required
                                />
                            ))}
                        </div>

                        <button type="submit">Verify OTP</button>
                    </form>
                )}

                {/* Login & Forgot Password */}
                {activeTab === "login" && resetStep === 0 && (
                    <form onSubmit={handleLoginSubmit} className={styles.form}>
                        <h2>Login</h2>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={loginData.email}
                            onChange={(e) => handleChange(e, setLoginData)}
                            className="inputText"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={(e) => handleChange(e, setLoginData)}
                            className="inputText"
                            required
                        />

                        <button type="submit">Login</button>
                        <button type="button" className={styles.forgotPassword} onClick={() => setResetStep(1)}>
                            Forgot Password?
                        </button>
                    </form>
                )}

                {/* Forgot Password - Enter Email */}
                {resetStep === 1 && (
                    <form onSubmit={handleForgotPassword} className={styles.form}>
                        <h2>Forgot Password</h2>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={resetData.email}
                            onChange={(e) => handleChange(e, setResetData)}
                            className="inputText"
                            required
                        />
                        <button type="submit">Send OTP</button>
                    </form>
                )}

                {/* Forgot Password - Enter OTP & New Password */}
                {resetStep === 2 && (
                    <form onSubmit={handleResetPassword} className={styles.form}>
                        <h2>Reset Password</h2>

                        {/* <input
                            type="text"
                            name="otp"
                            placeholder="OTP"
                            value={resetData.otp}
                            onChange={(e) => handleChange(e, setResetData)}
                            className="inputText"
                            required
                        /> */}
                        <div className="otpContainer">
                            {resetData.otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                    className="otpBox"
                                    required
                                />
                            ))}
                        </div>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            value={resetData.newPassword}
                            onChange={(e) => handleChange(e, setResetData)}
                            className="inputText"
                            required
                        />
                        <button type="submit">Reset Password</button>
                    </form>
                )}

                <p className={styles.message}>{message}</p>
            </div>
        </div>
    );
};

export default Login;
