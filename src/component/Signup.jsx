import React, { useState } from "react";
import "../component/Signup.css";
import { BASE_URL } from "../api/baseUrl";
import { useLocation, useNavigate } from "react-router-dom";

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine role from URL — /admin/signup → admin, else → user
  const isAdmin = location.pathname.startsWith("/admin");
  const role = isAdmin ? "admin" : "user";

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isAdmin
        ? `${BASE_URL}/api/admin/signup`
        : `${BASE_URL}/api/user/signup`;

      console.log(endpoint);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Signup successful! Redirecting...");
        setTimeout(() => {
          navigate(isAdmin ? "/admin/login" : "/login");
        }, 1500);
      } else {
        setMessage(data.msg || "Signup failed!");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server");
    }
  };

  return (
    <div className="outer">
      <div className="container">
        <h2>{isAdmin ? "Admin Signup" : "User Signup"}</h2>

        <form onSubmit={handleSubmit}>
          {/* No role dropdown — role is determined by URL */}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <div className="password-hint">
              Password must be at least 8 characters long and include at least
              one uppercase, one lowercase, one number, and one special character.
            </div>
          </div>

          <button className="signup" type="submit">Signup</button>
        </form>

        {message && <p id="message">{message}</p>}
      </div>
    </div>
  );
};

export default Signup;