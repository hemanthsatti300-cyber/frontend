import { useState } from "react";
import { askAI } from "../api/aiApi";
import "./AIAssistant.css";

import aiAgentIcon from "./ai-agent.png";

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        const text = message.trim();

        if (!text || loading) {
            return;
        }

        // Add user message to UI
        setMessages((prev) => [
            ...prev,
            {
                type: "user",
                text: text,
            },
        ]);

        setMessage("");

        // ==========================================
        // CHECK JWT TOKEN
        // ==========================================

        const token = localStorage.getItem("token");

        console.log(
            "AI Token:",
            token ? "Available" : "Not Available"
        );

        // ==========================================
        // NO TOKEN
        // ==========================================

        if (!token) {
            setMessages((prev) => [
                ...prev,
                {
                    type: "ai",
                    answer:
                        "🔐 Please login to use SentinelCore AI.",
                    authRequired: true,
                },
            ]);

            return;
        }

        // ==========================================
        // CALL AI API
        // ==========================================

        setLoading(true);

        try {
            const response = await askAI(text);

            setMessages((prev) => [
                ...prev,
                {
                    type: "ai",
                    answer:
                        response?.answer ||
                        "No response received from SentinelCore AI.",

                    suggestions:
                        response?.suggestions || [],
                },
            ]);
        } catch (error) {
            console.error(
                "SentinelCore AI Error:",
                error
            );

            const status =
                error?.response?.status;

            let errorMessage =
                "Unable to connect to SentinelCore AI.";

            if (status === 401) {
                errorMessage =
                    "🔐 Your session has expired. Please login again.";
            }

            if (status === 403) {
                errorMessage =
                    "⛔ You are not authorized to use SentinelCore AI.";
            }

            if (status === 404) {
                errorMessage =
                    "AI service endpoint was not found.";
            }

            if (status >= 500) {
                errorMessage =
                    "AI server error. Please try again later.";
            }

            setMessages((prev) => [
                ...prev,
                {
                    type: "ai",
                    answer: errorMessage,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestion = (suggestion) => {
        setMessage(suggestion);
    };

    const handleKeyDown = (event) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();
            sendMessage();
        }
    };

    const token = localStorage.getItem("token");

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

                    {/* HEADER */}
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
                                    SentinelCore AI
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


                    {/* CHAT */}
                    <div className="chat-window">

                        {/* INITIAL MESSAGE */}

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
                                    I am SentinelCore AI.
                                    I can help you with
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


                        {/* MESSAGES */}

                        {messages.map(
                            (item, index) => (
                                <div
                                    key={index}
                                    className={
                                        item.type === "user"
                                            ? "user-message"
                                            : "ai-message"
                                    }
                                >

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
                                            <div className="ai-message-header">

                                                <div className="message-avatar">

                                                    <img
                                                        src={aiAgentIcon}
                                                        alt="AI"
                                                    />

                                                </div>

                                                <strong>
                                                    SentinelCore AI
                                                </strong>

                                            </div>

                                            <p>
                                                {item.answer}
                                            </p>

                                            {item.authRequired && (
                                                <div className="login-required">

                                                    🔐 Please login
                                                    before using
                                                    SentinelCore AI.

                                                </div>
                                            )}

                                            {item.suggestions &&
                                                item.suggestions.length >
                                                    0 && (
                                                    <div className="suggestions">

                                                        {item.suggestions.map(
                                                            (
                                                                suggestion,
                                                                i
                                                            ) => (
                                                                <button
                                                                    key={i}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleSuggestion(
                                                                            suggestion
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        suggestion
                                                                    }
                                                                </button>
                                                            )
                                                        )}

                                                    </div>
                                                )}

                                        </>
                                    )}

                                </div>
                            )
                        )}


                        {/* LOADING */}

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

                                SentinelCore AI is thinking...

                            </div>
                        )}

                    </div>


                    {/* INPUT */}

                    <div className="chat-input">

                        <input
                            type="text"
                            value={message}
                            placeholder={
                                token
                                    ? "Ask SentinelCore AI..."
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


                    {/* SECURITY NOTICE */}

                    <div className="ai-security-notice">

                        🔒 AI responses require an
                        authenticated session.

                    </div>

                </div>
            )}
        </>
    );
}