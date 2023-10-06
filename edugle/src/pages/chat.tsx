import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import ChatMessages from "../components/ChatMessages";
import ChatBox from "../components/ChatBox";
import { useQuery, gql, useMutation, useSubscription } from "@apollo/client";
import { User, Message } from "../__generated__/graphql";
import SideBar from "../components/SideBar";

const POST_MESSAGE = gql(`
mutation CreateMessage($chat: ID!, $message: MessageInput!, $user: UserWithTokenInput!) {
  createMessage(chat: $chat, message: $message, user: $user) {
    content
    date
    id
    sender {
      id
      username
      role
      password
      lastLogin
      email
      avatar
      description
    }
  }
}`);

const CREATE_CHAT = gql(`
mutation CreateChat($chat: CreateChatInput) {
  createChat(chat: $chat) {
    created_date
    id
    messages {
      date
      content
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
    users {
      avatar
      description
      email
      id
      lastLogin
      username
    }
  }
}
`);

const ChatByUser = gql(`query ChatByUser($userId: ID!) {
  chatByUser(user_id: $userId) {
    created_date
    id
    messages {
      content
      date
      sender {
        avatar
        description
        email
        id
        lastLogin
        role
        password
        username
      }
      id
    }
    users {
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
`);

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
}
`);

const MESSAGE_CREATED = gql(`subscription MessageCreated($chatId: ID!) {
  messageCreated(chatId: $chatId) {
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
    users {
      avatar
      description
      email
      id
      lastLogin
      username
    }
  }
}`);

const ChatApp = () => {
  const [message, setMessage] = useState("");
  const messageData = useSubscription(MESSAGE_CREATED, {
    variables: {
      chatId: localStorage.getItem("chatID"),
    },
  });
  const [messages, setMessages] = useState(
    messageData.data?.messageCreated?.messages || [],
  );
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const chatRef = useRef<HTMLDivElement | null>(null);

  const user1ID = "651fd7a3668c9c643c724841";

  const getUser = useQuery(GET_USER_BY_ID, {
    variables: {
      getUserByIdId: user1ID,
    },
  });

  const user1: User = {
    id: getUser?.data?.getUserById?.id,
    username: getUser?.data?.getUserById?.username,
    email: getUser?.data?.getUserById?.email,
    password: getUser?.data?.getUserById?.password,
    description: getUser?.data?.getUserById?.description,
    avatar: getUser?.data?.getUserById?.avatar,
    lastLogin: getUser?.data?.getUserById?.lastLogin,
    role: getUser?.data?.getUserById?.role,
  };

  const user2ID = "651eaf720a898e92d1c963ca";

  const getUser2 = useQuery(GET_USER_BY_ID, {
    variables: {
      getUserByIdId: user2ID,
    },
  });
  const user2: User = {
    id: getUser2.data?.getUserById?.id,
    username: getUser2.data?.getUserById?.username,
    email: getUser2.data?.getUserById?.email,
    password: getUser2.data?.getUserById?.password,
    description: getUser2.data?.getUserById?.description,
    avatar: getUser2.data?.getUserById?.avatar,
    lastLogin: getUser2.data?.getUserById?.lastLogin,
    role: getUser2.data?.getUserById?.role,
  };

  const [createChat] = useMutation(CREATE_CHAT, {
    variables: {
      chat: {
        users: [user1.id, user2.id],
      },
    },
    onCompleted: ({ createChat }) => {
      console.log("createChat", createChat);
      localStorage.setItem("chatID", createChat.id);
    },
  });

  const [postMessage] = useMutation(POST_MESSAGE, {
    variables: {
      chat: localStorage.getItem("chatID"),
      message: {
        content: message,
        sender: user1.id,
      },
      user: {
        id: user1.id,
        token: localStorage.getItem("token"),
      },
    },
    onCompleted: ({ createMessage }) => {
      console.log("postMessage", createMessage);
    },
    onError: (error) => {
      console.log("postMessage error", postMessage);
      console.log("message", message);
      console.log("error", error);
    },
  });

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
    createChat();
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message !== "") {
      setMessages([
        ...messages,
        messageData.data?.messageCreated?.messages[0],
      ]);

      postMessage();
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
              <SideBar
                users={[user1]}
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

/*               */
