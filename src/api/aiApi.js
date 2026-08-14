import API from "./axios";

/* =========================================================
   ASK SENTINELCORE AI
   ========================================================= */

export const askAI = async (message) => {

    /* =====================================================
       VALIDATE MESSAGE
    ===================================================== */

    if (!message || !message.trim()) {
        throw new Error("Please enter a message.");
    }

    /* =====================================================
       GET JWT TOKEN
    ===================================================== */

    const token = localStorage.getItem("token");

    console.log(
        "🤖 AI Token:",
        token ? "Available" : "Not Available"
    );

    /* =====================================================
       IMPORTANT:
       DO NOT CALL BACKEND WITHOUT TOKEN
    ===================================================== */

    if (!token) {

        return {
            authenticated: false,
            answer:
                "🔐 Please login to use SentinelCore AI.",
            suggestions: [
                "Go to Login",
                "How do I login?"
            ]
        };
    }

    /* =====================================================
       CALL AI BACKEND
    ===================================================== */

    try {

        const response = await API.post(
            "/ai/ask",
            {
                message: message.trim(),
            }
        );

        console.log(
            "🤖 AI API Response:",
            response.data
        );

        return {
            authenticated: true,
            ...response.data,
        };

    } catch (error) {

        console.error(
            "❌ AI API Error:",
            error?.response?.data ||
            error?.message ||
            error
        );

        /* =================================================
           HANDLE UNAUTHORIZED
        ================================================= */

        if (error?.response?.status === 401) {

            return {
                authenticated: false,
                answer:
                    "🔐 Your session has expired. Please login again.",
                suggestions: [
                    "Login again"
                ]
            };
        }

        /* =================================================
           OTHER ERROR
        ================================================= */

        throw error;
    }
};