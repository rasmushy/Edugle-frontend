import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import ChatMessages from "../components/ChatMessages";
import ChatBox from "../components/ChatBox";
import { useQuery, gql, useMutation, useSubscription } from "@apollo/client";
import { Chat } from "../__generated__/graphql";
import { IUser, IMessage } from "../lib/types";
import SideBar from "../components/SideBar";
import { join } from "path";
import withAuth from "./api/auth/withAuth";
import LikeUser from "~/components/LikeUser";

const CREATE_MESSAGE = gql(`
mutation CreateMessage($chat: ID!, $message: MessageInput!) {
  createMessage(chat: $chat, message: $message) {
    content
    date
    id
    sender {
      email
      username
    }
  }
}`);

const CREATE_CHAT = gql(`
mutation CreateChat($chat: CreateChatInput) {
  createChat(chat: $chat) {
    created_date
    id
    messages {
      content
      date
      id
      sender {
        username
        id
      }
    }
    users {
      username
      lastLogin
    }
  }
}`);

const JOIN_CHAT = gql(`
mutation JoinChat($chatId: ID!, $token: String!) {
  joinChat(chatId: $chatId, token: $token) {
    messages {
      content
      date
      id
      sender {
        avatar
        description
        email
        id
        lastLogin
        password
        role
        username
      }
    }
    created_date
    id
    users {
      avatar
      description
      email
      lastLogin
      id
      username
    }
  }
}`);

const CHAT_BY_USER = gql(`
query ChatByUser($token: String!) {
  chatByUser(token: $token) {
    created_date
    id
    messages {
      date
      content
      id
      sender {
        description
        avatar
        email
        id
        lastLogin
        password
        role
        username
      }
    }
  }
}`);

const CHAT_BY_ID = gql(`
query ChatById($chatByIdId: ID!) {
  chatById(id: $chatByIdId) {
    created_date
    id
    messages {
      content
      date
      id
      sender {
        avatar
        description
        email
        id
        lastLogin
        password
        role
        username
      }
    }
  }
}`);

const GET_USER_BY_ID = gql(`
query GetUserById($getUserByIdId: ID!) {
  getUserById(id: $getUserByIdId) {
    id
    username
    email
    password
    description
    avatar
    lastLogin
    role
  }
}`);

const ChatApp = () => {
  const [message, setMessage] = useState("");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [chatID, setChatID] = useState("652122c39edea4edd683aba8");
  const [user1, setUser1] = useState<IUser | null>(null);
  const [user2, setUser2] = useState<IUser | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLikeUser, setIsLikeUser] = useState<Boolean>(false);

  /*   const chatByUser = useQuery(CHAT_BY_USER, {
    variables: {
      token: localStorage.getItem("token"),
    },
  onCompleted: ({ chatByUser }) => {
    console.log("chatByUser=", chatByUser.data.chatByUser);
  }
  });
 */
  const [joinChat] = useMutation(JOIN_CHAT, {
    variables: {
      chatId: chatID,
      token: localStorage.getItem("token"),
    },
    onCompleted: ({ joinChat }) => {
      console.log("joinChat=", joinChat);
      setUser1(joinChat.users[0]);
      setUser2(joinChat.users[1]);
      setChat(joinChat);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const [createChat] = useMutation(CREATE_CHAT, {
    variables: {
      chat: {
        users: [],
      },
    },
    onCompleted: ({ createChat }) => {
      console.log("createChat=", createChat);
      setChatID(createChat.id);
    },
  });

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    variables: {
      chat: chatID,
      message: {
        content: message,
        senderToken: localStorage.getItem("token"),
      },
    },
    onCompleted: ({ createMessage }) => {
      console.log("createMessage=", createMessage);
    },
    onError: (error) => {
      console.log("message that failed=", message);
      console.log("error", error);
    },
  });

  const handleNextUser = () => {
    console.log("Creating chat...");
    createChat();
  };
  /* {
    "created_date": "2023-10-07T09:20:03.482Z",
    "id": "652122c39edea4edd683aba8",
    "messages": [],
    "users": [],
    "__typename": "Chat"
} */
  const handleLikeUser = () => {
    setIsLikeUser(true);
  };

  const handleJoinChat = () => {
    let prompt = window.prompt("Enter chat ID", "652122c39edea4edd683aba8");
    if (prompt) {
      setChatID(prompt);
      console.log("Joining chat...");
      joinChat();
    }
  };

  const handleSendMessage = () => {
    if (message !== "") {
      createMessage();
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
        <div className="h-screen flex-row pl-4 pr-4">
          <div className="flex-col">
            {/* Chat messages */}
            {chat != null && <ChatMessages chat={chat as unknown as Chat} />}

            {/* Chat box */}
            <ChatBox
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              handleKeyPress={handleKeyPress}
              handleJoinChat={handleJoinChat}
            />

            {isLikeUser && (
              <LikeUser isLikeUser={isLikeUser} setIsLikeUser={setIsLikeUser} />
            )}
            <div
              className={`transition-all duration-500  ${
                isSidebarVisible ? "h-full" : "h-0"
              }`}
            >
              <SideBar
                users={[user1 as IUser, user2 as IUser]}
                handleNextUser={handleNextUser}
                handleLikeUser={handleLikeUser}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default ChatApp;