import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { askAI } from "../api/aiApi";
import "./AIAssistant.css";
import aiAgentIcon from "./ai-agent.png";

export default function AIAssistant() {

    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    // =====================================================
    // SEND MESSAGE
    // =====================================================

    const sendMessage = async () => {

        const text = message.trim();

        if (!text || loading) {
            return;
        }

        // =================================================
        // ADD USER MESSAGE
        // =================================================

        setMessages((prev) => [
            ...prev,
            {
                type: "user",
                text: text
            }
        ]);

        setMessage("");

        // =================================================
        // CHECK TOKEN
        // =================================================

        const token = localStorage.getItem("token");

        console.log(
            "🤖 AI Token:",
            token ? "Available" : "Not Available"
        );

        // =================================================
        // NO TOKEN
        // =================================================

        if (!token) {

            setMessages((prev) => [
                ...prev,
                {
                    type: "ai",
                    answer:
                        "🔐 Please login to use SentinelCore AI.",
                    authRequired: true,
                    action: "NONE",
                    route: null,
                    suggestions: [
                        "Go to Login"
                    ]
                }
            ]);

            return;
        }

        // =================================================
        // START LOADING
        // =================================================

        setLoading(true);

        try {

            // =================================================
            // CALL AI API
            // =================================================

            const response = await askAI(text);

            console.log(
                "🤖 SentinelCore AI Response:",
                response
            );

            // =================================================
            // ADD AI RESPONSE
            // =================================================

            setMessages((prev) => [
                ...prev,
                {
                    type: "ai",

                    answer:
                        response?.answer ||
                        "No response received from SentinelCore AI.",

                    action:
                        response?.action ||
                        "NONE",

                    route:
                        response?.route ||
                        null,

                    data:
                        response?.data ||
                        null,

                    suggestions:
                        response?.suggestions ||
                        []
                }
            ]);

            // =================================================
            // AI NAVIGATION
            // =================================================

            if (
                response?.action === "NAVIGATE" &&
                response?.route
            ) {

                console.log(
                    "🧭 AI Navigation:",
                    response.route
                );

                setTimeout(() => {

                    navigate(response.route);

                    // Close AI after navigation
                    setIsOpen(false);

                }, 700);
            }

        } catch (error) {

            console.error(
                "❌ SentinelCore AI Error:",
                error
            );

            const status =
                error?.response?.status;

            let errorMessage =
                "Unable to connect to SentinelCore AI.";

            // =================================================
            // 401
            // =================================================

            if (status === 401) {

                errorMessage =
                    "🔐 Your session has expired. Please login again.";

                localStorage.removeItem("token");
            }

            // =================================================
            // 403
            // =================================================

            else if (status === 403) {

                errorMessage =
                    "⛔ You are not authorized to use SentinelCore AI.";
            }

            // =================================================
            // 404
            // =================================================

            else if (status === 404) {

                errorMessage =
                    "❌ AI service endpoint was not found.";
            }

            // =================================================
            // 500+
            // =================================================

            else if (status >= 500) {

                errorMessage =
                    "⚠️ AI server error. Please try again later.";
            }

            // =================================================
            // ADD ERROR TO CHAT
            // =================================================

            setMessages((prev) => [
                ...prev,
                {
                    type: "ai",
                    answer: errorMessage,
                    action: "NONE",
                    route: null,
                    suggestions: []
                }
            ]);

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // SUGGESTION
    // =====================================================

    const handleSuggestion = (suggestion) => {

        setMessage(suggestion);

    };

    // =====================================================
    // KEYBOARD
    // =====================================================

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();
        }
    };

    const token =
        localStorage.getItem("token");

    // =====================================================
    // COMPONENT
    // =====================================================

    return (
        <>
            {/* =================================================
                FLOATING AI BUTTON
            ================================================= */}

            <button
                type="button"
                className={`ai-floating-button ${
                    isOpen ? "ai-button-open" : ""
                }`}
                onClick={() =>
                    setIsOpen((prev) => !prev)
                }
                title="SentinelCore AI"
            >

                <img
                    src={aiAgentIcon}
                    alt="SentinelCore AI"
                />

                {!isOpen && (
                    <span className="ai-pulse"></span>
                )}

            </button>


            {/* =================================================
                AI CHAT PANEL
            ================================================= */}

            {isOpen && (

                <div className="ai-panel">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="ai-header">

                        <div className="ai-title">

                            <div className="ai-small-avatar">

                                <img
                                    src={aiAgentIcon}
                                    alt="AI"
                                />

                            </div>

                            <div>

                                <h2>
                                    Cloud Security Monitoring System AI
                                </h2>

                                <span>
                                    Intelligent Security Assistant
                                </span>

                            </div>

                        </div>


                        <div className="ai-header-right">

                            <div className="ai-status">

                                <span className="status-dot"></span>

                                Online

                            </div>

                            <button
                                type="button"
                                className="ai-close-button"
                                onClick={() =>
                                    setIsOpen(false)
                                }
                            >
                                ×
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        CHAT WINDOW
                    ================================================= */}

                    <div className="chat-window">

                        {/* =================================================
                            WELCOME
                        ================================================= */}

                        {messages.length === 0 && (

                            <div className="ai-welcome">

                                <img
                                    src={aiAgentIcon}
                                    alt="SentinelCore AI"
                                    className="welcome-ai-image"
                                />

                                <h3>
                                    Hello! 👋
                                </h3>

                                <p>
                                    I am Cloud Security Monitoring System AI.
                                    I can help you navigate
                                    and work with your
                                    security operations,
                                    assets, alerts,
                                    vulnerabilities,
                                    incidents and
                                    infrastructure.
                                </p>

                                {!token && (

                                    <div className="login-required">

                                        🔐 Login required
                                        to receive AI
                                        responses.

                                    </div>

                                )}

                            </div>
                        )}


                        {/* =================================================
                            MESSAGES
                        ================================================= */}

                        {messages.map((item, index) => (

                            <div
                                key={index}
                                className={
                                    item.type === "user"
                                        ? "user-message"
                                        : "ai-message"
                                }
                            >

                                {/* =================================================
                                    USER
                                ================================================= */}

                                {item.type === "user" ? (

                                    <>
                                        <strong>
                                            You
                                        </strong>

                                        <p>
                                            {item.text}
                                        </p>
                                    </>

                                ) : (

                                    <>
                                        {/* =========================================
                                            AI HEADER
                                        ========================================= */}

                                        <div className="ai-message-header">

                                            <div className="message-avatar">

                                                <img
                                                    src={aiAgentIcon}
                                                    alt="AI"
                                                />

                                            </div>

                                            <strong>
                                                Cloud Security Monitoring System AI
                                            </strong>

                                        </div>


                                        {/* =========================================
                                            AI ANSWER
                                        ========================================= */}

                                        <p>
                                            {item.answer}
                                        </p>


                                        {/* =========================================
                                            NAVIGATION INFO
                                        ========================================= */}

                                        {item.action === "NAVIGATE" &&
                                            item.route && (

                                                <div className="ai-navigation-info">

                                                    🧭 Opening:
                                                    {" "}
                                                    {item.route}

                                                </div>
                                            )}


                                        {/* =========================================
                                            LOGIN REQUIRED
                                        ========================================= */}

                                        {item.authRequired && (

                                            <div className="login-required">

                                                🔐 Please login
                                                before using
                                                Cloud Security Monitoring System AI.

                                            </div>
                                        )}


                                        {/* =========================================
                                            SUGGESTIONS
                                        ========================================= */}

                                        {item.suggestions &&
                                            item.suggestions.length > 0 && (

                                                <div className="suggestions">

                                                    {item.suggestions.map(
                                                        (suggestion, i) => (

                                                            <button
                                                                key={i}
                                                                type="button"
                                                                onClick={() =>
                                                                    handleSuggestion(
                                                                        suggestion
                                                                    )
                                                                }
                                                            >
                                                                {suggestion}
                                                            </button>

                                                        )
                                                    )}

                                                </div>
                                            )}

                                    </>
                                )}

                            </div>

                        ))}


                        {/* =================================================
                            LOADING
                        ================================================= */}

                        {loading && (

                            <div className="typing">

                                <div className="typing-avatar">
                                    🤖
                                </div>

                                <div className="typing-dots">

                                    <span></span>
                                    <span></span>
                                    <span></span>

                                </div>

                                Cloud Security Monitoring System AI is thinking...

                            </div>
                        )}

                    </div>


                    {/* =================================================
                        INPUT
                    ================================================= */}

                    <div className="chat-input">

                        <input
                            type="text"
                            value={message}
                            placeholder={
                                token
                                    ? "Ask Cloud Security Monitoring System AI..."
                                    : "Login required to use AI..."
                            }
                            onChange={(event) =>
                                setMessage(
                                    event.target.value
                                )
                            }
                            onKeyDown={handleKeyDown}
                            disabled={
                                loading || !token
                            }
                        />

                        <button
                            type="button"
                            onClick={sendMessage}
                            disabled={
                                loading ||
                                !message.trim() ||
                                !token
                            }
                        >
                            {loading
                                ? "..."
                                : "Send"}
                        </button>

                    </div>


                    {/* =================================================
                        SECURITY NOTICE
                    ================================================= */}

                    {/* <div className="ai-security-notice">

                        🔒 AI responses require an
                        authenticated session.

                    </div> */}

                </div>
            )}

        </>
    );
}
