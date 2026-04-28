import React, { useState } from "react";
import "../component/Login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../api/baseUrl";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine role from URL — /admin/login → admin, else → user
  const isAdmin = location.pathname.startsWith("/admin");
  const role = isAdmin ? "admin" : "user";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const endpoint = isAdmin
        ? `${BASE_URL}/api/admin/signIn`
        : `${BASE_URL}/api/user/login`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("🧩 Login response:", data);

      if (res.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        localStorage.setItem("role", role);

        if (data.userId) {
          localStorage.setItem("userId", data.userId);
          console.log("✅ Stored userId:", data.userId);
        } else {
          console.warn("⚠️ userId missing in response");
        }

        if (isAdmin) navigate("/admin");
        else navigate("/home");
      } else {
        setMessage(data.msg || "Login failed!");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setMessage("Error connecting to server");
    }
  };

  return (
    <div className="outer">
      <div className="main">
        <h1>The World Thrift Hub</h1>

        {/* Dynamic heading based on role */}
        <h3>{isAdmin ? "Admin Login" : "User Login"}</h3>
        <p>Enter your {isAdmin ? "admin" : ""} login credentials</p>

        <form id="loginForm" onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
            autoComplete="username"
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="wrap">
            <button className="submit" type="submit">Submit</button>
          </div>
        </form>

        {/* Signup link — redirects to correct signup page based on role */}
        <p>
          Not registered?{" "}
          <Link
            to={isAdmin ? "/admin/signup" : "/signup"}
            style={{ textDecoration: "none", color: "blue" }}
          >
            Create an account
          </Link>
        </p>

        {message && <p id="message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;