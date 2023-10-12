import React, { useState, useEffect, use } from "react";
import Head from "next/head";
import ChatMessages from "../components/ChatMessages";
import ChatBox from "../components/ChatBox";
import { gql, useMutation, useSubscription } from "@apollo/client";
import ChatBar from "../components/ChatBar";
import LikeUser from "~/components/LikeUser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { Message } from "../__generated__/graphql";
import { set } from "zod";
import Paper from "@mui/material/Paper";
import CardMedia from "@mui/material/CardMedia";
import OceanImage from "../../public/images/asd.jpg";
import Image from "next/image";

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
  subscription ChatStarted {
    newChatStarted {
      created_date
      id
      messages {
        id
        date
        content
        sender {
          id
          username
        }
      }
      users {
        id
        username
      }
    }
  }
`;

const CHAT_ENDED = gql`
  subscription ChatEnded {
    chatEnded {
      created_date
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
  const [chatId, setChatId] = useState("651e95cac0d5c09577a765ce");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatStatus, setChatStatus] = useState("");
  const [isLikeUser, setIsLikeUser] = useState<boolean>(false);
  const [token, setToken] = useState(session.data?.user?.token as string);

  useEffect(() => {
    if (session.status === "loading") return;
    if (!session || !session.data?.user) {
      router.replace("/");
    }
  }, [session]);

  const [initiateChat] = useMutation(INITIATE_CHAT, {
    variables: {
      token: token,
    },
    onCompleted: ({ initiateChat }) => {
      console.log("initiateChat=", initiateChat);
      setChatStatus(initiateChat.status);
    },
    onError: (error) => {
      console.log("initiateChat error=", initiateChat);
      console.log("error", error.message);
    },
  });

  const messageCreated = useSubscription(MESSAGE_CREATED, {
    variables: { chatId: chatId },
    onSubscriptionData: ({ subscriptionData }) => {
      console.log("messageCreated: subscriptionData=", subscriptionData);
    },
    onError: (error) => {
      messageCreated.data.messageCreated.messages.refetch();
      console.log("error=", error.message);
    },
  });

  const chatStarted = useSubscription(CHAT_STARTED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log("chatStarted: subData=", subscriptionData.data.chatStarted);
      setChatId(subscriptionData.data.chatStarted.id);
      setChatStatus("Paired");
    },
    onError: (error) => {
      console.log("error", error);
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
      console.log("error", error);
    },
  });

  const handleLikeUser = () => {
    setIsLikeUser(true);
  };

  const handleNextUser = () => {
    console.log("handleJoinChat: Joining queue...");
    initiateChat();
    console.log("handleJoinChat: chatID=", chatId);
  };

  useEffect(() => {
    if (messageCreated.data) {
      console.log("messageCreated.data=", messageCreated.data);
      setMessages(messageCreated.data?.messageCreated?.messages as Message[]);
    }
  }, [messageCreated.data]);

  useEffect(() => {
    if (chatStarted.data) {
      console.log("chatStarted.data=", chatStarted.data);
    }
  }, [chatStarted.data]);

  useEffect(() => {
    if (chatEnded.data) {
      console.log("chatEnded.data=", chatEnded.data);
    }
  }, [chatEnded.data]);

  if (session.status === "authenticated") {
    return (
      <>
        <Head>
          <title>Edugle</title>
          <meta name="chat" content="Chatroom" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main style={{}} className="min-w-screen z-10 mt-6 bg-gradient-to-b to-[#2C7DA0] text-white">
          <Paper
            elevation={3} // Add elevation for shadow
            sx={{
              borderRadius: 5, // Add rounded corners
              margin: 0,
              marginLeft: "20px",
              marginRight: "20px",
              padding: 0,
              boxShadow: "0px 0px 10px 10px rgba(0, 0, 0, 0.4)",
              position: "relative",
              overflow: "hidden",
              backgroundColor: "white", // Background color
              backgroundImage: `url(${OceanImage.src})`,
            }}
          >
            <div className="flex-row">
              <div className="flex-col" style={{ top: "3%", position: "relative" }}>
                {/* Chat messages */}
                {chatId != "" && <ChatMessages chatMessages={messages} />}

                {/* Chat box */}
                <ChatBox chatId={chatId} user={token} />

                {isLikeUser && <LikeUser isLikeUser={isLikeUser} setIsLikeUser={setIsLikeUser} />}
                {/* Sidebar: with functions for liking and joining next chat */}
                {/*  <ChatBar chatId={chatId} user={token} chatStatus={chatStatus} handleLikeUser={handleLikeUser} handleNextUser={handleNextUser} />*/}
              </div>
            </div>
          </Paper>
        </main>
      </>
    );
  }
};
export default ChatApp;
