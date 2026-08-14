import {
  FaTachometerAlt,
  FaServer,
  FaUsers,
  FaShieldAlt,
  FaBug,
  FaCloud,
  FaChartBar,
  FaBell,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "./AuthContext";
import "./Dashboard.css";

function Sidebar() {
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/dashboard",
      roles: ["ADMIN", "ITSM", "USER"],
    },
    {
      title: "Assets",
      icon: <FaServer />,
      path: "/assets",
      roles: ["ADMIN", "ITSM"],
    },
    {
      title: "Alerts",
      icon: <FaBell />,
      path: "/alerts",
      roles: ["ADMIN", "ITSM", "USER"],
    },
    {
      title: "Incidents",
      icon: <FaBug />,
      path: "/incidents",
      roles: ["ADMIN", "ITSM"],
    },
    {
      title: "Vulnerabilities",
      icon: <FaShieldAlt />,
      path: "/vulnerabilities",
      roles: ["ADMIN", "ITSM"],
    },
    {
      title: "Cloud",
      icon: <FaCloud />,
      path: "/cloud",
      roles: ["ADMIN", "ITSM"],
    },
    {
      title: "Reports",
      icon: <FaChartBar />,
      path: "/reports",
      roles: ["ADMIN", "ITSM", "USER"],
    },
    {
      title: "Users",
      icon: <FaUsers />,
      path: "/users",
      roles: ["ADMIN"],
    },
  ];

  // Close mobile sidebar when screen becomes desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMenuClick = () => {
    if (window.innerWidth <= 768) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <motion.div
        animate={{
          width:
            window.innerWidth <= 768
              ? 270
              : collapsed
              ? 90
              : 270,
        }}
        transition={{
          duration: 0.3,
        }}
        className={`sidebar ${
          mobileOpen ? "mobile-sidebar-open" : ""
        }`}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-circle">
            🛡️
          </div>

          {!collapsed && (
            <div className="logo-text">
              <h2>SentinelCore</h2>
              <span>SecureOps</span>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        <button
          className="mobile-close-btn"
          onClick={() => setMobileOpen(false)}
        >
          <FaTimes />
        </button>

        {/* Desktop Collapse */}
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <FaChevronRight />
          ) : (
            <FaChevronLeft />
          )}
        </button>

        {/* User */}
        <div className="sidebar-user">
          <img
            src={`https://ui-avatars.com/api/?name=${
              user?.username || "Admin"
            }&background=2563eb&color=fff`}
            alt="profile"
          />

          {!collapsed && (
            <div className="sidebar-user-info">
              <h4>{user?.username || "Admin"}</h4>
              <p>{user?.role || "USER"}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <ul className="sidebar-menu">
          {menu
            .filter((item) =>
              item.roles.includes(user?.role)
            )
            .map((item) => (
              <li key={item.title}>
                <NavLink
                  to={item.path}
                  onClick={handleMenuClick}
                  className={({ isActive }) =>
                    isActive ? "active-link" : ""
                  }
                >
                  <span className="menu-icon">
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <p>{item.title}</p>
                  )}
                </NavLink>
              </li>
            ))}
        </ul>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={logout}
          >
            <FaSignOutAlt />

            {!collapsed && (
              <span>Logout</span>
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
}

export default Sidebar;