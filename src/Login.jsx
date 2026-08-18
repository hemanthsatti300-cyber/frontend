import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { useAuth } from "./AuthContext";

import "./Auth.css";

function Login() {

  const { login } = useAuth();

  // ==========================================
  // STATE
  // ==========================================

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // ==========================================
  // LOGIN SUBMIT
  // ==========================================

  const submit = async (e) => {

    e.preventDefault();

    // ------------------------------------------
    // Remove unnecessary spaces
    // ------------------------------------------

    const cleanEmail = email.trim().toLowerCase();

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!cleanEmail && !password.trim()) {

      toast.warning(
        "Please enter your email and password."
      );

      return;
    }

    if (!cleanEmail) {

      toast.warning(
        "Please enter your email."
      );

      return;
    }

    if (!password.trim()) {

      toast.warning(
        "Please enter your password."
      );

      return;
    }

    // ------------------------------------------
    // Basic email validation
    // ------------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {

      toast.warning(
        "Please enter a valid email address."
      );

      return;
    }

    // ==========================================
    // START LOADING
    // ==========================================

    setLoading(true);

    try {

      // ========================================
      // CALL AUTH CONTEXT
      // ========================================

      const success = await login(
        cleanEmail,
        password
      );

      // ========================================
      // SUCCESS
      // ========================================

      if (success) {

        toast.success(
          "Login successful! Welcome to SentinelCore 🎉"
        );

      }

    } catch (error) {

      console.error(
        "Login Error:",
        error
      );

      // ========================================
      // SERVER NOT REACHABLE
      // ========================================

      if (!error.response) {

        toast.error(
          "❌ Backend server is unreachable."
        );

        return;
      }

      // ========================================
      // BACKEND RESPONSE
      // ========================================

      const status =
        error.response.status;

      const backendMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "";

      // ========================================
      // 400 BAD REQUEST
      // ========================================

      if (status === 400) {

        toast.warning(
          backendMessage ||
          "Invalid login request."
        );

      }

      // ========================================
      // 401 UNAUTHORIZED
      // ========================================

      else if (status === 401) {

        toast.error(
          backendMessage ||
          "Invalid email or password."
        );

      }

      // ========================================
      // 403 FORBIDDEN
      // ========================================

      else if (status === 403) {

        toast.warning(
          backendMessage ||
          "Please verify your email before logging in."
        );

      }

      // ========================================
      // 404 NOT FOUND
      // ========================================

      else if (status === 404) {

        toast.error(
          "Authentication service not found."
        );

      }

      // ========================================
      // 500 SERVER ERROR
      // ========================================

      else if (status === 500) {

        toast.error(
          backendMessage ||
          "Internal server error. Please try again."
        );

      }

      // ========================================
      // OTHER ERROR
      // ========================================

      else {

        toast.error(
          backendMessage ||
          "Unable to login. Please try again."
        );

      }

    } finally {

      setLoading(false);

    }

  };

  // ==========================================
  // JSX
  // ==========================================

  return (

    <div className="auth-container">

      <motion.div

        className="auth-card"

        initial={{
          opacity: 0,
          y: 80,
          scale: 0.95,
        }}

        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}

        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}

      >

        {/* ====================================
            LOGO
        ==================================== */}

        <div className="logo">

          <FaShieldAlt />

          <h1>
           Cloud Security 
          </h1>

        </div>


        {/* ====================================
            TITLE
        ==================================== */}

        <h2>
          Monitoring System Login
        </h2>

        <p>
          Enterprise Security Operations Center
        </p>


        {/* ====================================
            LOGIN FORM
        ==================================== */}

        <form onSubmit={submit}>

          {/* ==================================
              EMAIL
          ================================== */}

          <div className="input-group">

            <FaEnvelope className="input-icon" />

            <input

              type="email"

              placeholder="Email Address"

              value={email}

              onChange={(e) =>
                setEmail(e.target.value)
              }

              autoComplete="email"

              disabled={loading}

            />

          </div>


          {/* ==================================
              PASSWORD
          ================================== */}

          <div className="password-box">

            <FaLock className="input-icon" />

            <input

              type={
                showPassword
                  ? "text"
                  : "password"
              }

              placeholder="Password"

              value={password}

              onChange={(e) =>
                setPassword(e.target.value)
              }

              autoComplete="current-password"

              disabled={loading}

            />

            <button

              type="button"

              className="eye"

              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }

              disabled={loading}

              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }

            >

              {showPassword ? (

                <FaEyeSlash />

              ) : (

                <FaEye />

              )}

            </button>

          </div>


          {/* ==================================
              FORGOT PASSWORD
          ================================== */}

         {/* <div className="forgot-password">

            <Link to="/forgot-password">

              Forgot Password?

            </Link>

          </div> */}


          {/* ==================================
              LOGIN BUTTON
          ================================== */}

          <button

            type="submit"

            className="login-btn"

            disabled={loading}

          >

            {loading ? (

              <>
                <span className="spinner"></span>

                Authenticating...
              </>

            ) : (

              "Login"

            )}

          </button>

        </form>


        {/* ====================================
            EMAIL VERIFICATION MESSAGE
        ==================================== */}
{/* 
        <div className="verify-note">

          <FaShieldAlt />

          <span>

            If you recently registered,
            please verify your email before
            logging in.

          </span>

        </div> */}


        {/* ====================================
            REGISTER
        ==================================== */}

        <div className="bottom-link">

          <span>
            Don't have an account?
          </span>

          <Link to="/register">

            Register

          </Link>

        </div>

      </motion.div>

    </div>

  );

}

export default Login;
