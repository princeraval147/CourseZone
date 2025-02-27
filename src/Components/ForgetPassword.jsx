import { useState } from "react";

function ForgetPassword() {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP & new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    setMessage(data.message);

    if (response.ok) setStep(2);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await response.json();
    setMessage(data.message);

    if (response.ok) {
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {step === 1 ? (
        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            required
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            required
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit">Reset Password</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgetPassword;
