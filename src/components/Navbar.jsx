import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import { useTheme } from "../ThemeContext";

export default function Navbar({ firebaseUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const links = [
    { path: "/", label: "🏠 Home" },
    { path: "/compare", label: "⚔️ Compare" },
    { path: "/history", label: "🕐 History" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        {/* Left — Brand */}
        <div className="navbar-brand" onClick={() => handleNav("/")}>
          <svg height="28" viewBox="0 0 16 16" width="28" fill="currentColor" className="navbar-logo-svg">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span className="navbar-brand-text">GitHub Analyser</span>
        </div>

        {/* Center — Links (desktop) */}
        <div className="navbar-links">
          {links.map((l) => (
            <button
              key={l.path}
              className={`navbar-link${isActive(l.path) ? " active" : ""}`}
              onClick={() => handleNav(l.path)}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Right — Theme toggle + Email + Logout (desktop) */}
        <div className="navbar-right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span className={`theme-icon ${theme === "dark" ? "show" : ""}`}>🌙</span>
            <span className={`theme-icon ${theme === "light" ? "show" : ""}`}>☀️</span>
          </button>
          <span className="navbar-email">{firebaseUser?.email}</span>
          <button className="navbar-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="navbar-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div className={`navbar-mobile-menu${mobileOpen ? " open" : ""}`}>
        {links.map((l) => (
          <button
            key={l.path}
            className={`navbar-link${isActive(l.path) ? " active" : ""}`}
            onClick={() => handleNav(l.path)}
          >
            {l.label}
          </button>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px" }}>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span className={`theme-icon ${theme === "dark" ? "show" : ""}`}>🌙</span>
            <span className={`theme-icon ${theme === "light" ? "show" : ""}`}>☀️</span>
          </button>
          <span className="navbar-email" style={{ maxWidth: "100%" }}>{firebaseUser?.email}</span>
        </div>
        <button className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
}
