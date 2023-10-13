import React, { useState, useEffect, use } from "react";
import Head from "next/head";
import ChatMessages from "../components/ChatMessages";
import ChatBox from "../components/ChatBox";
import { gql, useMutation, useSubscription } from "@apollo/client";
import ChatBar from "../components/ChatBar";
import LikeUser from "~/components/LikeUser";
import { useSession } from "next-auth/react";
import type { Message } from "../__generated__/graphql";
import { useRouter } from "next/navigation";

const INITIATE_CHAT = gql`
  mutation InitiateChat($token: String!) {
    initiateChat(token: $token) {
      ... on PairedChatResponse {
        chatId
        status
      }
      ... on QueuePositionResponse {
        position
        status
      }
    }
  }
`;
const MESSAGE_CREATED = gql`
  subscription Subscription($chatId: ID!) {
    messageCreated(chatId: $chatId) {
      created_date
      id
      messages {
        id
        content
        date
        sender {
          avatar
          id
          username
        }
      }
    }
  }
`;
const CHAT_STARTED = gql`
  subscription ChatStarted($userId: ID!) {
    chatStarted(userId: $userId) {
      id
      users {
        id
        username
      }
      messages {
        id
        content
        date
        sender {
          id
          username
        }
      }
    }
  }
`;

const CHAT_ENDED = gql`
  subscription ChatEnded {
    chatEnded {
      id
      users {
        id
        username
      }
      messages {
        id
        content
        date
        sender {
          id
          username
        }
      }
    }
  }
`;

const ChatApp = () => {
  const session = useSession();
  const router = useRouter();
  const [chatId, setChatId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatStatus, setChatStatus] = useState("");
  const [isLikeUser, setIsLikeUser] = useState<boolean>(false);

  if (!session || session.status === "unauthenticated") {
    console.log("ChatApp: session=", session);
    router.push("/");
  }

  const [initiateChat] = useMutation(INITIATE_CHAT, {
    variables: {
      token: session.data?.token as string,
    },
    onCompleted: ({ initiateChat }) => {
      console.log("initiateChat COMPLETED=", initiateChat);
      setChatStatus(initiateChat.status);
      if (initiateChat.status === "Paired") {
        setChatId(initiateChat.chatId);
      }
    },
    onError: (error) => {
      console.log("initiateChat: error=", error.message);
    },
  });

  const messageCreated = useSubscription(MESSAGE_CREATED, {
    variables: { chatId: chatId },
    onError: (error) => {
      console.log("messageCreated: error=", error.message);
    },
  });

  const chatStarted = useSubscription(CHAT_STARTED, {
    variables: { userId: session.data?.user?.id },
    onSubscriptionData: ({ subscriptionData }) => {
      console.log("chatStarted: subData=", subscriptionData.data.chatStarted);
      setChatId(subscriptionData.data.chatStarted.id);
      setChatStatus("Paired");
    },
    onError: (error) => {
      console.log("chatStarted: error=", error);
    },
  });

  const chatEnded = useSubscription(CHAT_ENDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log("chatEnded: subData=", subscriptionData.data.chatEnded);
      setChatId("");
      setChatStatus("Ended");
      setMessages([]);
    },
    onError: (error) => {
      console.log("chatEnded: error=", error);
    },
  });

  const handleLikeUser = () => {
    setIsLikeUser(true);
  };

  const handleNextUser = () => {
    initiateChat();
  };

  useEffect(() => {
    if (!messageCreated.data) {
      setMessages([]);
      return;
    }
   // console.log("messageCreated.data=", messageCreated.data);
    setMessages(messageCreated.data?.messageCreated?.messages as Message[]);
  }, [messageCreated.data]);

  useEffect(() => {
    if (chatStarted.data) {
      // console.log("chatStarted.data=", chatStarted.data);
    }
  }, [chatStarted.data]);

  useEffect(() => {
    if (chatEnded.data) {
      // console.log("chatEnded.data=", chatEnded.data);
    }
  }, [chatEnded.data]);

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
            {chatId != "" && <ChatMessages chatMessages={messages} />}

            {/* Chat box */}
            <ChatBox chatId={chatId} user={session.data?.token as string} />

            {isLikeUser && <LikeUser isLikeUser={isLikeUser} setIsLikeUser={setIsLikeUser} />}
            {/* Sidebar: with functions for liking and joining next chat */}
            <ChatBar
              chatId={chatId}
              user={session.data?.token as string}
              chatStatus={chatStatus}
              handleLikeUser={handleLikeUser}
              handleNextUser={handleNextUser}
            />
          </div>
        </div>
      </main>
    </>
  );
};
export default ChatApp;
