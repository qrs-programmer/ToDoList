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
  const { user } = useAuth0();
  const [messages, setMessages] = useState<Chat[]>([]);
  const [input, setInput] = useState("");

  const handleClick = async () => {
    setLoading(true);
    try {
      setInput("Creating Task...");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/gemini`,
        {
          userId: user?.sub,
          prompt: input,
        }
      );
      console.log("AI Response:", res.data);
      onTaskCreated();
      setInput("Task Created ✅");
    } catch (err) {
      console.error(err);
      setInput("Retry ❌");
    } finally {
      setLoading(false);
      setTimeout(() => setInput(""), 2000);
    }
  };

  return (
    <div className="chat-input-container">
      <input
        className="chat-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your task..."
      />
      <button className="chat-send-btn" onClick={handleClick}>
        Send
      </button>
    </div>
  );
};

export default GeminiChatButton;
