"use client";
import React, { useState } from "react";
import { socket } from "@/lib/socketClinet";

const ChatForm = ({
  onSendMessage,
  setTyping,
  username,
  room,
  setTypingMessage,
}: {
  onSendMessage: (message: string) => void;
  setTyping: (typing: boolean) => void;
  username: string;
  room: string;
  setTypingMessage: (typing: string) => void;
}) => {
  const [message, setMessage] = useState("");

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(message);
    setMessage("");
    setTyping(false);
    setTypingMessage("");
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setTyping(true);

    // 🔥 Fix: Emit a string message, not an object
    socket.emit("typing", {
      room,
      message: `${username} is typing...`,
    });

    // Stop typing after 1 second
    setTimeout(() => {
      setTyping(false);
      setTypingMessage("");
    }, 1000);
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="flex gap-2 w-[90vw] mx-auto justify-between"
    >
      <input
        type="text"
        placeholder="type your message here"
        onChange={handleMessageChange}
        value={message}
        className="border-2 border-blue-400 w-full py-2 px-4 focus:outline-none focus:outline-gray-400 rounded-lg"
      />
      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-400 cursor-pointer"
      >
        Submit
      </button>
    </form>
  );
};

export default ChatForm;