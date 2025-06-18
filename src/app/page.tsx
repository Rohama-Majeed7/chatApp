"use client";
import React, { useEffect, useState } from "react";
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { socket } from "@/lib/socketClinet";

const Page = () => {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [userName, setUserName] = useState("");
  const [typing, setTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const [messages, setMessages] = useState<
    { message: string; sender: string }[]
  >([]);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("user-joined", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message, sender: "System" },
      ]);
    });

    socket.on("typing", (data: string) => {
      setTypingMessage(data);
      setTyping(true);

      // Auto-clear typing message after 2 seconds
      setTimeout(() => {
        setTyping(false);
        setTypingMessage("");
      }, 2000);
    });

    return () => {
      socket.off("user-joined");
      socket.off("message");
      socket.off("typing");
    };
  }, []);

  const handleSendMessage = (message: string) => {
    const data = { room, message, sender: userName };
    setMessages((prev) => [...prev, { message, sender: userName }]);
    setTypingMessage(""); // Clear typing message when message sent
    socket.emit("message", data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (room && userName) {
      socket.emit("join-room", { room, username: userName });
      setJoined(true);
    }
  };

  return (
    <section>
      {!joined ? (
        <div className="flex justify-center items-center h-[90vh]">
          <form
            onSubmit={handleSubmit}
            className="flex shadow-blue-400 shadow-lg flex-col items-center gap-5 justify-center p-8 border-black border-2 rounded-lg"
          >
            <h1 className="text-3xl font-bold">Chat Room</h1>
            <input
              type="text"
              placeholder="Enter username"
              className="border-2 border-blue-400 py-2 px-4 focus:outline-none focus:outline-gray-400 rounded-lg"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />
            <input
              type="text"
              placeholder="Enter room name"
              className="border-2 border-blue-400 py-2 px-4 focus:outline-none focus:outline-gray-400 rounded-lg"
              onChange={(e) => setRoom(e.target.value)}
              value={room}
            />
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-400 cursor-pointer"
            >
              Join Room
            </button>
          </form>
        </div>
      ) : (
        <>
          <section className="h-[95vh] flex justify-between flex-col gap-3">
            <h1 className="text-2xl font-bold w-[90vw] mx-auto my-4">
              CHAT ROOM : <span className="text-blue-600">{room}</span>
            </h1>

            <div className="h-[80vh] bg-gray-300 w-[90vw] mx-auto rounded-lg overflow-y-auto px-4 py-2">
              {messages.map((msg, index) => {
                const isOwnMessage = msg.sender === userName;
                return (
                  <ChatMessage
                    key={index}
                    isOwnMessage={isOwnMessage}
                    sender={msg.sender}
                    message={msg.message}
                  />
                );
              })}

              {typing && typingMessage && (
                <div className="bg-gray-600 text-white w-fit px-4 py-1 rounded-md italic mb-2">
                  {typingMessage}
                </div>
              )}
            </div>

            <ChatForm
              onSendMessage={handleSendMessage}
              setTyping={setTyping}
              username={userName}
              room={room} // 👈 pass room
              setTypingMessage={setTypingMessage}
            />
          </section>
        </>
      )}
    </section>
  );
};

export default Page;
