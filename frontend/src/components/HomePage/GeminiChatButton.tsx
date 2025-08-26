import axios from "axios";
import React, { useState } from "react";

type GeminiChatButton = {};

const GeminiChatButton: React.FC<GeminiChatButton> = ({}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/gemini`,
        { prompt: "Study calculus for math class tomorrow at 1pm" }
      );
      console.log("AI Response:", res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? "Processing..." : "Test AI Task"}
    </button>
  );
};

export default GeminiChatButton;
