import { useEffect, useState } from "react";

import {
  FaBell,
  FaMoon,
  FaSun,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./AuthContext";
import SearchBar from "./SearchBar";

import "./Dashboard.css";

function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  /* =========================================
     STATES
  ========================================= */

  const [time, setTime] = useState(new Date());

  const [showProfile, setShowProfile] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* =========================================
     LIVE CLOCK
  ========================================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* =========================================
     THEME
  ========================================= */

  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* =========================================
     MOBILE SIDEBAR
  ========================================= */

  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen;

    setMobileMenuOpen(newState);

    window.dispatchEvent(
      new CustomEvent("mobile-sidebar-toggle", {
        detail: {
          open: newState,
        },
      })
    );
  };

  /* =========================================
     CLOSE MOBILE SIDEBAR
  ========================================= */

  useEffect(() => {
    const handleSidebarClose = () => {
      setMobileMenuOpen(false);
    };

    window.addEventListener(
      "mobile-sidebar-close",
      handleSidebarClose
    );

    return () => {
      window.removeEventListener(
        "mobile-sidebar-close",
        handleSidebarClose
      );
    };
  }, []);

  /* =========================================
     PROFILE
  ========================================= */

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  /* =========================================
     NOTIFICATION
     Simply navigate to Alerts page
  ========================================= */

  const handleNotifications = () => {
    setShowProfile(false);
    navigate("/alerts");
  };

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="navbar">

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="navbar-left">

          <div className="navbar-brand">

            <h2>
              🛡️ SentinelCore SecureOps
            </h2>

            <p>
              Enterprise Security Operations Center
            </p>

          </div>

        </div>


        {/* =================================================
            CENTER SEARCH
        ================================================= */}

        <div className="navbar-center">

          <div className="search-box">

            <SearchBar />

          </div>

        </div>


        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="navbar-right">

          {/* CLOCK */}

          <motion.div
            className="clock"
            whileHover={{
              scale: 1.05,
            }}
          >

            <div className="clock-time">
              {time.toLocaleTimeString()}
            </div>

            <div className="clock-date">
              {time.toLocaleDateString()}
            </div>

          </motion.div>


          {/* THEME */}

          <motion.button
            className="theme-toggle"
            whileHover={{
              scale: 1.1,
            }}
            whileTap={{
              scale: 0.9,
            }}
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >

            {darkMode ? (
              <FaMoon />
            ) : (
              <FaSun />
            )}

          </motion.button>


          {/* =================================================
              NOTIFICATION BELL

              Clicking the bell directly opens /alerts
          ================================================= */}

          <motion.button
            className="notification"
            whileHover={{
              scale: 1.1,
            }}
            whileTap={{
              scale: 0.9,
            }}
            onClick={handleNotifications}
            aria-label="Open alerts"
            title="View Alerts"
          >

            <FaBell className="bell-icon" />

          </motion.button>


          {/* PROFILE */}

          <motion.div
            className="profile"
            whileHover={{
              scale: 1.03,
            }}
            onClick={toggleProfile}
          >

            <img
              src={`https://ui-avatars.com/api/?name=${
                user?.username || "Admin"
              }&background=2563eb&color=ffffff&bold=true`}
              alt="Profile"
            />

            <div className="profile-info">

              <h4>
                {user?.username || "Administrator"}
              </h4>

              <p>
                {user?.role || "ADMIN"}
              </p>

            </div>

          </motion.div>


          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          {/* <button
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
          >

            {mobileMenuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}

          </button> */}

        </div>

      </header>


      {/* =================================================
          PROFILE MENU
      ================================================= */}

      {showProfile && (

        <motion.div
          className="profile-menu"

          initial={{
            opacity: 0,
            y: -15,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}
        >

          <div className="profile-header">

            <FaUserCircle size={50} />

            <div>

              <h3>
                {user?.username || "Administrator"}
              </h3>

              <p>
                {user?.email || "admin@sentinelcore.com"}
              </p>

              <span className="profile-role">
                {user?.role || "ADMIN"}
              </span>

            </div>

          </div>

          <hr />

          <button
            className="logout"
            onClick={handleLogout}
          >

            <FaSignOutAlt />

            Logout

          </button>

        </motion.div>

      )}

    </>
  );
}

export default Navbar;