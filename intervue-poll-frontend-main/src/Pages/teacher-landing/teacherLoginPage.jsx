import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TeacherLoginPage = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleLogin = () => {
    if (username.trim() === "") {
      alert("Please enter a valid username.");
    } else {
      sessionStorage.setItem("username", username);
      navigate("/teacher-home-page");
    }
  };

  // Inline styles
  const styles = {
    page: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f9f9f9",
      fontFamily: "Arial, sans-serif",
    },
    container: {
      textAlign: "center",
      padding: "20px",
      width: "90%",
      maxWidth: "400px",
      backgroundColor: "#ffffff",
      border: "1px solid #e0e0e0",
      borderRadius: "15px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      fontSize: "1.8rem",
      color: "#333333",
      marginBottom: "20px",
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "10px 0",
      border: "1px solid #ccc",
      borderRadius: "10px",
      fontSize: "1rem",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "12px",
      marginTop: "15px",
      fontSize: "1rem",
      fontWeight: "bold",
      color: "white",
      background: "linear-gradient(90deg, #6f42c1, #6f42c1)",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "background 0.3s ease, transform 0.2s ease",
    },
    buttonHover: {
      background: "linear-gradient(90deg, #6149f5, #7b2ff7)",
      transform: "translateY(-2px)",
    },
    inputFocus: {
      outline: "none",
      border: "1px solid #7b2ff7",
      boxShadow: "0 0 5px rgba(123, 47, 247, 0.3)",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Teacher Login</h2>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={handleUsernameChange}
          style={styles.input}
        />
        <button
          style={styles.button}
          onMouseEnter={(e) => (e.target.style.background = styles.buttonHover.background)}
          onMouseLeave={(e) => (e.target.style.background = styles.button.background)}
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default TeacherLoginPage;
