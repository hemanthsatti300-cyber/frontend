import "./AIAssistant.css";
import { FaRobot, FaUserCircle } from "react-icons/fa";

function ChatMessage({ message }) {
  const isBot = message.sender === "bot";

  return (
    <div className={`chat-message ${isBot ? "bot" : "user"}`}>
      {/* Avatar */}
      <div className="chat-avatar">
        {isBot ? (
          <FaRobot className="bot-avatar" />
        ) : (
          <FaUserCircle className="user-avatar" />
        )}
      </div>

      {/* Message */}
      <div className="chat-content">
        <div className={`chat-bubble ${isBot ? "bot-bubble" : "user-bubble"}`}>
          <div className="chat-text">
            {message.text.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>

        <span className="chat-time">
          {message.time || ""}
        </span>
      </div>
    </div>
  );
}

export default ChatMessage;