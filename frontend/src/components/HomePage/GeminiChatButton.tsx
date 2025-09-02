import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import React, { useState } from "react";
import { Chat } from "../../models/chat.model";
import "./GeminiChatButton.css";

type GeminiChatButton = {
  onTaskCreated: any;
};

const GeminiChatButton: React.FC<GeminiChatButton> = ({ onTaskCreated }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const { user } = useAuth0();
  const [messages, setMessages] = useState<Chat[]>([]);
  const [input, setInput] = useState("");

  const getStatusText = () => {
    switch (status) {
      case "loading":
        return "";
      case "success":
        return "Created";
      case "error":
        return "Retry";
      default:
        return "Send";
    }
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      setStatus("loading");
      setInput("");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/gemini`,
        {
          userId: user?.sub,
          prompt: input,
        }
      );
      console.log("AI Response:", res.data);
      onTaskCreated();
      setStatus("success");
      //setInput("Created ✅");
    } catch (err) {
      console.error(err);
      setStatus("error");
      //setInput("Retry ❌");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus("idle"), 2000);
      //setTimeout(() => setInput(""), 2000);
    }
  };

  return (
    <div className="chat-input-container">
      <input
        className={`chat-input`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your task..."
      />
      <button
        className={`chat-send-btn ${status}`}
        onClick={handleClick}
        disabled={
          status === "loading" || status === "success" || status === "error"
        }
      >
        <div className={status === "loading" ? "spinner" : ""}>
          {getStatusText()}
        </div>
      </button>
    </div>
  );
};

export default GeminiChatButton;
