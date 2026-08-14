import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import API from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  /* ===========================
     Load User
  =========================== */

  useEffect(() => {

    const initialize = async () => {

      const token = localStorage.getItem("token");

      if (!token) {

        setLoading(false);

        return;

      }

      try {

        API.defaults.headers.common.Authorization =
          `Bearer ${token}`;

        const response =
          await API.get("/users/profile");

        setUser(response.data);

      }

      catch (err) {

        console.error(err);

        logout();

      }

      finally {

        setLoading(false);

      }

    };

    initialize();

  }, []);

  /* ===========================
     Login
  =========================== */

  const login = async (

    email,

    password

  ) => {

    const response = await API.post(

      "/auth/login",

      {

        email,

        password

      }

    );

    const { token, user } = response.data;

    localStorage.setItem(

      "token",

      token

    );

    API.defaults.headers.common.Authorization =
      `Bearer ${token}`;

    setUser(user);

  };

  /* ===========================
     Register
  =========================== */

  const register = async (

    form

  ) => {

    await API.post(

      "/auth/register",

      form

    );

  };
    /* ===========================
     Logout
  =========================== */

  const logout = () => {

    localStorage.removeItem("token");

    delete API.defaults.headers.common.Authorization;

    setUser(null);

  };

  /* ===========================
     Refresh Profile
  =========================== */

  const refreshProfile = async () => {

    try {

      const response = await API.get("/users/profile");

      setUser(response.data);

    }

    catch (err) {

      console.error(err);

    }

  };

  /* ===========================
     Role Helpers
  =========================== */

  const hasRole = (...roles) => {

    if (!user) return false;

    return roles.includes(user.role);

  };

  const isAdmin = hasRole("ADMIN");

  const isManager = hasRole("MANAGER");

  const isAnalyst = hasRole("ANALYST");

  const isUser = hasRole("USER");

  /* ===========================
     Permission Helpers
  =========================== */

  const canManageUsers = () =>

    hasRole(

      "ADMIN",

      "MANAGER"

    );

  const canEditAssets = () =>

    hasRole(

      "ADMIN",

      "MANAGER",

      "ANALYST"

    );

  const canDeleteAssets = () =>

    hasRole(

      "ADMIN"

    );

  const canManageIncidents = () =>

    hasRole(

      "ADMIN",

      "MANAGER",

      "ANALYST"

    );

  const canViewReports = () =>

    hasRole(

      "ADMIN",

      "MANAGER",

      "ANALYST",

      "USER"

    );

  /* ===========================
     Context Value
  =========================== */

  const value = {

    user,

    loading,

    login,

    register,

    logout,

    refreshProfile,

    hasRole,

    isAdmin,

    isManager,

    isAnalyst,

    isUser,

    canManageUsers,

    canEditAssets,

    canDeleteAssets,

    canManageIncidents,

    canViewReports

  };

  /* ===========================
     Loading Screen
  =========================== */

  if (loading) {

    return (

      <div className="auth-loading">

        <div className="loader"></div>

        <h2>

          Loading SecureOps...

        </h2>

      </div>

    );

  }

  return (

    <AuthContext.Provider

      value={value}

    >

      {children}

    </AuthContext.Provider>

  );

}