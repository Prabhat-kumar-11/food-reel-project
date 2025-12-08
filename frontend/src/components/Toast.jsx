import React, { useEffect, useState } from "react";
import "../styles/toast.css";

const Toast = ({ message, type = "error", duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "✕";
    }
  };

  return (
    <div className={`toast toast-${type} ${isVisible ? "toast-enter" : "toast-exit"}`}>
      <span className="toast-icon">{getIcon()}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}>
        ×
      </button>
    </div>
  );
};

// Toast Container to manage multiple toasts
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Custom hook for toast management
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "error", duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showSuccess = (message) => addToast(message, "success");
  const showError = (message) => addToast(message, "error");
  const showWarning = (message) => addToast(message, "warning");
  const showInfo = (message) => addToast(message, "info");

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default Toast;

