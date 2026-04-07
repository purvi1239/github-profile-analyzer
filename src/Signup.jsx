import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function Signup({ switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Wait for auth state change
    } catch (err) {
      alert(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ width: "100%", textAlign: "center" }}>
          <h2 className="auth-title">Join Now</h2>
          <p className="auth-subtitle">Create an account to get started</p>
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

        <button className="auth-button" onClick={handleSignup} disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="auth-link" onClick={switchToLogin}>
          Already have an account? <span>Login</span>
        </p>
      </div>
    </div>
  );
}