import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "./api/axios";

const AuthContext = createContext();

/* ===========================
   Custom Hook
=========================== */

export const useAuth = () => useContext(AuthContext);

/* ===========================
   Provider
=========================== */

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  /* ===========================
     Load User Profile
  =========================== */

  const loadProfile = async () => {
    try {
      const response = await API.get("/users/profile");

      setUser(response.data);

      localStorage.setItem(
        "currentUser",
        JSON.stringify(response.data)
      );
    } catch (error) {
      console.error(error);
      logout(false);
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     Check Existing Login
  =========================== */

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    loadProfile();
  }, []);

  /* ===========================
     Register
  =========================== */

/* ===========================
   Register
=========================== */

const register = async (newUser) => {

  try {

    const payload = {

      username: newUser.username.trim(),

      email: newUser.email.trim().toLowerCase(),

      department: newUser.department?.trim() || "",

      role: newUser.role || "USER",

      password: newUser.password,

    };

    const response = await API.post(
      "/auth/register",
      payload
    );

    console.log("Registration Success:", response.data);

    toast.success(
      response.data?.message ||
      "🎉 Account created successfully!"
    );

    return true;

  } catch (error) {

    console.error(
      "Registration Error:",
      error.response?.data || error
    );

    // Server not reachable
    if (!error.response) {

      toast.error(
        "Unable to connect to the server."
      );

      return false;

    }

    switch (error.response.status) {

      case 400:

        toast.error(
          error.response.data?.message ||
          "Invalid registration details."
        );

        break;

      case 401:

        toast.error(
          error.response.data?.message ||
          "Unauthorized request."
        );

        break;

      case 403:

        toast.error(
          error.response.data?.message ||
          "Username(or)Email is already Exist."
        );

        break;

      case 404:

        toast.error(
          "Registration service not found."
        );

        break;

      case 409:

        toast.error(
          error.response.data?.message ||
          "User already exists with this email."
        );

        break;

      case 500:

        toast.error(
          error.response.data?.message ||
          "Internal server error."
        );

        break;

      default:

        toast.error(
          error.response.data?.message ||
          "Unable to create account."
        );

    }

    return false;

  }

};
  /* ===========================
     Login
  =========================== */

  const login = async (email, password) => {
    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      localStorage.setItem("token", data.token);

      const currentUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        department: data.department,
        role: data.role,
      };

      localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
      );

      setUser(currentUser);

      toast.success(`Welcome ${currentUser.username}`);

      navigate("/dashboard");

      return true;
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Invalid email or password."
      );

      return false;
    }
  };

  /* ===========================
     Logout
  =========================== */

  const logout = (redirect = true) => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");

    setUser(null);

    if (redirect) {
      toast.info("Logged out.");
      navigate("/login");
    }
  };

  /* ===========================
     Role Helpers
  =========================== */

  const isAdmin = () => user?.role === "ADMIN";

  const isITSM = () => user?.role === "ITSM";

  const isUser = () => user?.role === "USER";

  /* ===========================
     Context Value
  =========================== */

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loadProfile,
    isAdmin,
    isITSM,
    isUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
