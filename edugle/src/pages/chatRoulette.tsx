import React, { useState, useEffect, use } from "react";
import Head from "next/head";
import ChatMessages from "../components/ChatMessages";
import ChatBox from "../components/ChatBox";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import ChatBar from "../components/ChatBar";
import LikeUser from "~/components/LikeUser";
import { useSession } from "next-auth/react";
import type { Message } from "../__generated__/graphql";
import { useRouter } from "next/router";
import { set } from "zod";
import Paper from "@mui/material/Paper";
import CardMedia from "@mui/material/CardMedia";
import RulesGif from "../../public/images/rules.gif";
import OceanImage from "../../public/images/ocean.jpg";
import Image from "next/image";
import styles from "../styles/styles.module.css";

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

const DE_QUEUE = gql`
  mutation DeQueueUser($token: String!) {
    dequeueUser(token: $token) {
      position
      status
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

const IS_QUEUE = gql(`query QueuePosition($token: String!) {
  queuePosition(token: $token) {
    position
    status
  }
}`);

const ASD = gql(`query Queue {
  queue {
    joinedAt
    position
    userId {
      id
    }
  }
}`);

const ChatApp = () => {
  const session = useSession();
  const router = useRouter();
  const [chatId, setChatId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatStatus, setChatStatus] = useState("");
  const [isLikeUser, setIsLikeUser] = useState<boolean>(false);
  const [isQueue, setIsQueue] = useState<boolean>(false);
  const [firstTime, setFirstTime] = useState<boolean>(true);
  const { loading, error, data } = useQuery(IS_QUEUE, {
    variables: {
      token: session.data?.token as string,
    },
  });

  const isQuery = useQuery(IS_QUEUE, {
    variables: {
      token: session.data?.token as string,
    },
  });

  const [dequeueUser] = useMutation(DE_QUEUE, {
    variables: {
      token: session.data?.token as string,
    },
    onCompleted: ({ dequeueUser }) => {
      console.log("dequeueUser COMPLETED=", dequeueUser);
      setIsQueue(false);
    },
    onError: (error) => {
      console.log("dequeueUser: error=", error.message);
    },
  });

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
      isQuery.refetch();
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

  const handleStartQueue = () => {
    const isQueuePosition = isQuery.data?.queuePosition.position;

    if (isQueuePosition === 0) {
      console.log(isQueue);
      initiateChat();
      setIsQueue(true);
    } else {
      console.log(isQuery.data?.queuePosition);
    }
  };

  const handleBack = () => {
    dequeueUser().then(() => {
      console.log(data.queuePosition.position);
    });
  };

  useEffect(() => {
    if (!messageCreated.data) {
      return;
    }
    console.log("messageCreated.data=", messageCreated.data);
    setMessages(messageCreated.data?.messageCreated?.messages as Message[]);
  }, [messageCreated.data]);

  useEffect(() => {
    if (chatStarted.data) {
      console.log("chatStarted.data=", chatStarted.data);
    }
  }, [chatStarted.data]);

  useEffect(() => {
    if (chatEnded.data) {
      // console.log("chatEnded.data=", chatEnded.data);
    }
  }, [chatEnded.data]);

  useEffect(() => {
    if (chatStatus === "Paired") setFirstTime(false);
  }, [chatStatus]);

  return (
    <>
      <Head>
        <title>Edugle</title>
        <meta name="chat" content="Chatroom" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{}} className="min-w-screen z-10 mt-6 bg-gradient-to-b to-[#2C7DA0] text-white">
        {firstTime ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Paper
              elevation={3} // Add elevation for shadow
              sx={{
                borderRadius: 5, // Add rounded corners
                margin: 0,
                marginLeft: "20px",
                marginRight: "20px",
                padding: 0,
                width: "90vw",
                height: "78vh !important",
                boxShadow: "0px 0px 10px 10px rgba(0, 0, 0, 0.4)",
                position: "relative",
                overflow: "hidden",
                backgroundColor: "white", // Background color
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh", flexDirection: "column" }}>
                <img src={RulesGif.src} alt="Image" style={{ width: "650px", marginBottom: "20px", borderRadius: "50px", boxShadow: "5px 5px 3px gray" }} />
                <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Read Before Entering</h1>
                <p style={{ fontSize: "16px", textAlign: "center", marginBottom: "40px" }}>Do you know the rules about talking to strangers online? </p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button
                    onClick={() => handleStartQueue()}
                    style={{ fontSize: "16px", padding: "10px 20px", background: "#014F86", color: "white", border: "none", borderRadius: "5px" }}
                  >
                    I Know the Rules
                  </button>
                  <button
                    onClick={() => handleBack()}
                    style={{ fontSize: "16px", padding: "10px 20px", background: "#E53E3E", color: "white", border: "none", borderRadius: "5px" }}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </Paper>
          </div>
        ) : (
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
                {chatId != "" && <ChatMessages chatMessages={messages} yourUsername={session?.data?.user.username} />}

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
          </Paper>
        )}
      </main>
    </>
  );
};
export default ChatApp;
