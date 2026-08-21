import API from "./axios";

// =========================================================
// ASK SENTINELCORE AI
// =========================================================

export const askAI = async (message) => {

    // =====================================================
    // VALIDATE MESSAGE
    // =====================================================

    if (!message || !message.trim()) {
        throw new Error("Please enter a message.");
    }

    const token = localStorage.getItem("token");

    console.log(
        "🤖 AI Token:",
        token ? "Available" : "Not Available"
    );

    // =====================================================
    // NO TOKEN
    // =====================================================

    if (!token) {
        return {
            authenticated: false,
            answer: "🔐 Please login to use SentinelCore AI.",
            action: "NONE",
            route: null,
            data: null,
            suggestions: [
                "Go to Login",
                "How do I login?"
            ]
        };
    }

    // =====================================================
    // CALL BACKEND
    // =====================================================

    try {

        const response = await API.post(
            "/ai/ask",
            {
                message: message.trim()
            }
        );

        console.log(
            "🤖 AI API Response:",
            response.data
        );

        // =================================================
        // IMPORTANT
        // Backend returns:
        //
        // {
        //   message: "...",
        //   action: "NAVIGATE",
        //   route: "/cloud",
        //   data: null
        // }
        //
        // Frontend converts message -> answer
        // =================================================

        return {
            authenticated: true,

            answer:
                response.data?.message ||
                "SentinelCore AI did not return a message.",

            action:
                response.data?.action ||
                "NONE",

            route:
                response.data?.route ||
                null,

            data:
                response.data?.data ||
                null,

            suggestions:
                response.data?.suggestions ||
                []
        };

    } catch (error) {

        console.error(
            "❌ AI API Error:",
            error?.response?.data ||
            error?.message ||
            error
        );

        // =================================================
        // 401 UNAUTHORIZED
        // =================================================

        if (error?.response?.status === 401) {

            localStorage.removeItem("token");

            return {
                authenticated: false,
                answer:
                    "🔐 Your session has expired. Please login again.",
                action: "NONE",
                route: null,
                data: null,
                suggestions: [
                    "Login again"
                ]
            };
        }

        // =================================================
        // 403 FORBIDDEN
        // =================================================

        if (error?.response?.status === 403) {

            return {
                authenticated: true,
                answer:
                    "🚫 You are authenticated, but you are not authorized to use SentinelCore AI.",
                action: "NONE",
                route: null,
                data: null,
                suggestions: [
                    "Contact administrator"
                ]
            };
        }

        // =================================================
        // 404 NOT FOUND
        // =================================================

        if (error?.response?.status === 404) {

            return {
                authenticated: true,
                answer:
                    "❌ SentinelCore AI endpoint was not found.",
                action: "NONE",
                route: null,
                data: null,
                suggestions: [
                    "Check the backend server"
                ]
            };
        }

        // =================================================
        // SERVER ERROR
        // =================================================

        if (error?.response?.status >= 500) {

            return {
                authenticated: true,
                answer:
                    "⚠️ SentinelCore AI server error. Please try again later.",
                action: "NONE",
                route: null,
                data: null,
                suggestions: [
                    "Try again"
                ]
            };
        }

        // =================================================
        // NETWORK ERROR
        // =================================================

        if (!error?.response) {

            return {
                authenticated: true,
                answer:
                    "🌐 Unable to connect to SentinelCore AI server.",
                action: "NONE",
                route: null,
                data: null,
                suggestions: [
                    "Check the backend server",
                    "Try again"
                ]
            };
        }

        throw error;
    }
};
