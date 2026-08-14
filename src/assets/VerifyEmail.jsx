import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaShieldAlt,
} from "react-icons/fa";

import API from "../api/axios";
import "../Auth.css";

function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    let ignore = false;

    const verify = async () => {
      const token = params.get("token");

      if (!token) {
        if (!ignore) {
          setStatus("error");
          setMessage("Invalid verification link.");
        }
        return;
      }

      try {
        const response = await API.get(`/auth/verify?token=${token}`);

        if (ignore) return;

        setStatus("success");

        setMessage(
          typeof response.data === "string"
            ? response.data
            : "Email verified successfully."
        );

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        if (ignore) return;

        setStatus("error");

        setMessage(
          error.response?.data ||
            "Verification failed or the verification link has expired."
        );
      }
    };

    verify();

    return () => {
      ignore = true;
    };
  }, [params, navigate]);

  return (
    <div className="auth-container">
      <div
        className="auth-card"
        style={{
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        <div className="logo">
          <FaShieldAlt size={42} />
          <h1>SentinelCore</h1>
        </div>

        {status === "loading" && (
          <>
            <FaSpinner
              size={60}
              className="spin"
              style={{ color: "#3b82f6" }}
            />

            <h2>Verifying Email</h2>

            <p>{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <FaCheckCircle
              size={70}
              color="#22c55e"
            />

            <h2>Email Verified</h2>

            <p>{message}</p>

            <p style={{ marginTop: 15 }}>
              Redirecting to Login...
            </p>

            <Link
              to="/login"
              className="login-btn"
              style={{
                display: "inline-block",
                marginTop: "20px",
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <FaTimesCircle
              size={70}
              color="#ef4444"
            />

            <h2>Verification Failed</h2>

            <p>{message}</p>

            <Link
              to="/register"
              className="login-btn"
              style={{
                display: "inline-block",
                marginTop: "20px",
                textDecoration: "none",
              }}
            >
              Register Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;