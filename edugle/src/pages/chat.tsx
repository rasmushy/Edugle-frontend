import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Header from "../components/Header";
import ChatMessages from "../components/ChatMessages";
import ChatBox from "../components/ChatBox";
import SideBar from "../components/SideBar";
import { User, Message } from "../lib/types";
import { useQuery, gql } from "@apollo/client";

const GET_MESSAGES = gql`
  query GetMessages {
    messages {
      id
      sender
      content
    }
  }
`;

/* const Messages = ({ user }) => {
  const { data } = useQuery(GET_MESSAGES);
  if (!data) {
    return null;
  }
  return JSON.stringify(data);
};
 */
const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const chatRef = useRef<HTMLDivElement | null>(null);

  const user1: User = {
    avatar: "", // URL to avatar
    username: "John",
    description: "Loves programming",
  };

  const user2: User = {
    avatar: "", // URL to avatar
    username: "Jane",
    description: "Loves hiking",
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleNextUser = () => {
    // Logic to get the next user
    console.log("Next user");
  };

  const handleLikeUser = () => {
    // Logic to like the user
    console.log("Liked user");
  };

  const handleUploadImage = () => {
    // Logic to upload an image
    console.log("Uploaded image");
  };

  const handleInsertEmoji = () => {
    // Logic to insert an emoji
    console.log("Inserted emoji");
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message !== "") {
      setMessages([...messages, { sender: user1.username, content: message }]);
      console.log("Sent message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      // Manually handle new lines for shift+enter
      const cursorPosition = e.currentTarget.selectionStart;
      const content =
        message.substring(0, cursorPosition) +
        "\n" +
        message.substring(cursorPosition);
      setMessage(content);

      // Set cursor position right after the inserted newline
      setTimeout(() => {
        if (e.currentTarget) {
          e.currentTarget.selectionStart = cursorPosition + 1;
          e.currentTarget.selectionEnd = cursorPosition + 1;
        }
      }, 0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Head>
        <title>Edugle</title>
        <meta name="chat" content="Chatroom" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-w-screen min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <Header
          onLogout={() => console.log("Logged out")}
          onProfile={() => console.log("View profile")}
          onSettings={() => console.log("View settings")}
          toggleSidebar={toggleSidebar}
        />
        <div className="flex-row pl-4 pr-4">
          <div className="flex-col">
            {/* Chat messages */}
            <ChatMessages messages={messages} />
            {/* Chat box */}
            <ChatBox
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              handleKeyPress={handleKeyPress}
              handleUploadImage={handleUploadImage}
              handleInsertEmoji={handleInsertEmoji}
            />
            <div
              className={`transition-all duration-500  ${
                isSidebarVisible ? "h-full" : "h-0"
              }`}
            >
              {isSidebarVisible && (
                <SideBar
                  users={
                    [user2] /* Replace with users={[user1,user2]} from API */
                  }
                  handleNextUser={handleNextUser}
                  handleLikeUser={handleLikeUser}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default Chat;
