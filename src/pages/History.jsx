import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

function timeAgo(dateStr) {
  const now = new Date();
  const then = new Date(dateStr);
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Not authenticated");
    return currentUser.getIdToken();
  };

  const fetchHistory = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHistory(data);
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = await getToken();
      await fetch(`${API}/history/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory((prev) => prev.filter((item) => item._id !== id));
      toast.success("Deleted from history");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleClick = (username) => {
    navigate(`/?search=${encodeURIComponent(username)}`);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">🕐 Search History</h1>
      <p className="page-subtitle">Your recently searched GitHub profiles</p>

      {loading && (
        <div className="spinner-container">
          <div className="spinner" />
        </div>
      )}

      {!loading && history.length === 0 && (
        <div className="empty-state fade-in">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">No history yet</div>
          <div className="empty-state-text">
            Search for a GitHub profile on the Home page to get started!
          </div>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="history-list fade-in">
          {history.map((item) => (
            <div key={item._id} className="history-item">
              <div
                className="history-item-left"
                onClick={() => handleClick(item.githubUsername)}
              >
                <div className="history-avatar-placeholder">👤</div>
                <div>
                  <div className="history-username">{item.githubUsername}</div>
                  <div className="history-time">
                    {timeAgo(item.searchedAt)}
                  </div>
                </div>
              </div>
              <button
                className="history-delete"
                onClick={() => handleDelete(item._id)}
                title="Delete from history"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
