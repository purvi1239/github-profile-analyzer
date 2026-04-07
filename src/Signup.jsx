import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function Signup({ switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful 🎉");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fade-in glass" style={styles.container}>
      <h2>Sign Up</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleSignup} style={styles.button}>
        Sign Up
      </button>

      <p onClick={switchToLogin} style={styles.link}>
        Already have an account? Login
      </p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
  },
  input: {
    padding: "12px",
    width: "250px",
    borderRadius: "6px",
    border: "1px solid #30363d",
    background: "#0d1117",
    color: "white",
    outline: "none",
  },
  button: {
    padding: "12px 20px",
    background: "#238636",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.3s",
  }
};