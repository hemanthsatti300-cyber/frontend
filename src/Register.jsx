import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
} from "react-icons/fa";

import { useAuth } from "./AuthContext";

import "./Auth.css";

function Register() {
  const { register } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    department: "",
    role: "USER",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const update = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.username.trim()) {
      toast.warning("Please enter your username.");
      return;
    }

    if (!form.email.trim()) {
      toast.warning("Please enter your email.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!form.department.trim()) {
      toast.warning("Please enter your department.");
      return;
    }

    if (!form.password) {
      toast.warning("Please enter your password.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const success = await register({
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        department: form.department.trim(),
        role: form.role,
        password: form.password,
      });

      if (success) {
        toast.success(
          "🎉 Registration Successful!\n\nA verification email has been sent to your email address.\nPlease verify your email before logging in.",
          {
            autoClose: 6000,
          }
        );

        setForm({
          username: "",
          email: "",
          department: "",
          role: "USER",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 5000);
      }
    } catch (error) {
      toast.error(
        error.response?.data ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card register-card"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="logo">
          <FaShieldAlt />
          <h1>Cloud Security Monitoring System </h1>
        </div>

        <h2>Create Account</h2>

        <p>Enterprise Security Operations Center</p>

        <form onSubmit={submit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={update}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={update}
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={update}
          />
      <label htmlFor="role">Select Role:</label>
          <select
            name="role"
            value={form.role}
            onChange={update}
          >
            <option value="USER">USER</option>
             <option value="ITSM">ITSM</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={update}
            />

            <button
              type="button"
              className="eye"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={update}
          />

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>
        </form>

        <div className="bottom-link">
          Already have an account?
          <Link to="/login"> Login</Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
