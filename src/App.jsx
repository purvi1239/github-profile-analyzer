import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./ThemeContext";

import Login from "./Login";
import Signup from "./Signup";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Compare from "./pages/Compare";
import History from "./pages/History";

function App() {
  const [firebaseUser, setFirebaseUser] = useState(undefined);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user ?? null);
    });
    return () => unsub();
  }, []);

  // Still loading auth
  if (firebaseUser === undefined) {
    return (
      <div style={{
        height: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#0d1117", color: "#8b949e",
        fontFamily: "monospace"
      }}>
        Loading...
      </div>
    );
  }

  // Not logged in
  if (!firebaseUser) {
    return (
      <ThemeProvider>
        <Toaster position="top-right" toastOptions={{
          style: { background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)", fontFamily: "monospace" },
        }} />
        {isLogin
          ? <Login switchToSignup={() => setIsLogin(false)} />
          : <Signup switchToLogin={() => setIsLogin(true)} />}
      </ThemeProvider>
    );
  }

  // Logged in
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)", fontFamily: "monospace" },
        }} />
        <Navbar firebaseUser={firebaseUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
