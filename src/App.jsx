import { Routes, Route, Navigate } from "react-router-dom";

// =====================================================
// AUTHENTICATION
// =====================================================

import Login from "./Login";
import Register from "./Register";
import VerifyEmail from "./assets/VerifyEmail";
import AIAssistant from "./assets/AIAssistant";

// =====================================================
// MAIN PAGES
// =====================================================

import Dashboard from "./Dashboard";
import Assets from "./Assets";
import Alerts from "./Alerts";
import Users from "./Users";
import Reports from "./Reports";
import Vulnerabilities from "./Vulnerabilities";
import Incidents from "./Incidents";
import Cloud from "./Cloud";
import Profile from "./Profile";
import Settings from "./Settings";

// =====================================================
// ROUTING
// =====================================================

import ProtectedRoute from "./ProtectedRoute";
import NotFound from "./NotFound";

function App() {
    return (
        <Routes>

            {/* =================================================
                ROOT
            ================================================= */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            {/* =================================================
                AUTHENTICATION
            ================================================= */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/verify-email"
                element={<VerifyEmail />}
            />

            {/* =================================================
                DASHBOARD
                ADMIN + ITSM + USER
            ================================================= */}

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "ADMIN",
                            "ITSM",
                            "USER",
                        ]}
                    >
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* =================================================
                ASSETS
                ADMIN + ITSM
            ================================================= */}

            <Route
                path="/assets"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "ADMIN",
                            "ITSM",
                        ]}
                    >
                        <Assets />
                    </ProtectedRoute>
                }
            />

            {/* =================================================
                ALERTS
                ADMIN + ITSM + USER
            ================================================= */}

            <Route
                path="/alerts"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "ADMIN",
                            "ITSM",
                            "USER",
                        ]}
                    >
                        <Alerts />
                    </ProtectedRoute>
                }
            />

            {/* =================================================
                VULNERABILITIES
                ADMIN + ITSM
            ================================================= */}

            <Route
                path="/vulnerabilities"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "ADMIN",
                            "ITSM",
                        ]}
                    >
                        <Vulnerabilities />
                    </ProtectedRoute>
                }
            />

            {/* =================================================
                INCIDENTS
                ADMIN + ITSM
            ================================================= */}

            <Route
                path="/incidents"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "ADMIN",
                            "ITSM",
                        ]}
                    >
                        <Incidents />
                    </ProtectedRoute>
                }
            />

            {/* =================================================
                CLOUD
                ADMIN + ITSM
            ================================================= */}

            <Route
                path="/cloud"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "ADMIN",
                            "ITSM",
                        ]}
                    >
                        <Cloud />
                    </ProtectedRoute>
                }
            />

            {/* =================================================
                REPORTS
                ADMIN + ITSM + USER
            ================================================= */}

            <Route
                path="/reports"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "ADMIN",
                            "ITSM",
                            "USER",
                        ]}
                    >
                        <Reports />
                    </ProtectedRoute>
                }
            />

            {/* =================================================
                USERS
                ADMIN ONLY
            ================================================= */}

            <Route
                path="/users"
                element={
                    <ProtectedRoute
                        allowedRoles={["ADMIN"]}
                    >
                        <Users />
                    </ProtectedRoute>
                }
            />

            {/* =================================================
                PROFILE
                ADMIN + ITSM + USER
            ================================================= */}

            <Route
                path="/profile"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "ADMIN",
                            "ITSM",
                            "USER",
                        ]}
                    >
                        <Profile />
                    </ProtectedRoute>
                }
            />

            {/* =================================================
                SETTINGS
                ADMIN ONLY
            ================================================= */}

            <Route
                path="/settings"
                element={
                    <ProtectedRoute
                        allowedRoles={["ADMIN"]}
                    >
                        <Settings />
                    </ProtectedRoute>
                }
            />

            {/* =================================================
                404
            ================================================= */}

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>
    );
}

export default App;