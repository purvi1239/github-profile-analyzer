import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function Login({ switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Successfully logged in
    } catch (err) {
      alert(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ width: "100%", textAlign: "center" }}>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Login to analyze GitHub profiles</p>
        </div>
        
        <div className="auth-input-group">
          <input
            className="auth-input"
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="auth-input-group">
          <input
            className="auth-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="auth-button" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <div className="spinner"></div> // Optional: can add a CSS spinner if wanted, or just text
          ) : (
             "Login"
          )}
        </button>

        <p className="auth-link" onClick={switchToSignup}>
          Don't have an account? <span>Sign Up</span>
        </p>
      </div>
    </div>
  );
}