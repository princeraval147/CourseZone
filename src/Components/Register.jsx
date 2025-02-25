import { useState } from "react";

function Register() {
  const [step, setStep] = useState(1); // 1 -> Register, 2 -> Verify OTP
  const [form, setForm] = useState({ username: "", email: "", password: "", otp: "" });
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      // Register Request
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, email: form.email, password: form.password }),
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: form.otp }),
      });

      const data = await response.json();
      setMessage(data.message);
      if (response.ok) {
        setStep(3); // OTP verified, registration complete
      }
    }
  };

  return (
    <div>
      {step === 1 && (
        <>
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              required onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              required onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="submit">Register</button>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <h2>Verify OTP</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter OTP"
              required
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
            />
            <button type="submit">Verify OTP</button>
          </form>
        </>
      )}

      <p>{message}</p>
    </div>
  );
}

export default Register;
