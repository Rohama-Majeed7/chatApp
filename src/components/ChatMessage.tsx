"use client";
import React from "react";

interface ChatMessageProps {
  isOwnMessage: boolean;
  sender: string;
  message: string;
}

const ChatMessage = ({ sender, isOwnMessage, message }: ChatMessageProps) => {
  const isSystemMessage = sender === "System";

  return (
    <div
      className={`flex ${
        isSystemMessage
          ? "justify-center"
          : isOwnMessage
          ? "justify-end"
          : "justify-start"
      } p-2 my-3`}
    >
      <div
        className={`${
          isSystemMessage
            ? "border-2 border-blue-700 text-nowrap bg-black text-white rounded-lg font-bold"
            : isOwnMessage
            ? "bg-blue-600 text-white"
            : "bg-white text-black"
        } p-3 max-w-[70%] rounded-lg`}
      >
        {isSystemMessage ? (
          <p className="font-bold">{message}</p>
        ) : (
          <div className="flex flex-col gap-1 w-[150px]">
            <p className="font-bold">{sender}</p>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;