import React, { useState, useEffect } from "react";
import Head from "next/head";
import ChatMessages from "../components/chatComponents/ChatMessages";
import ChatBox from "../components/chatComponents/ChatBox";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import ChatBar from "../components/chatComponents/ChatBar";
import LikeUser from "~/components/chatComponents/LikeUser";
import { useSession } from "next-auth/react";
import type { Message } from "../__generated__/graphql";
import { useRouter } from "next/navigation";
import Paper from "@mui/material/Paper";
import OceanImage from "../../public/images/ocean.jpg";
import styles from "../styles/styles.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import tips from "../styles/tips";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import QueuePanel from "~/components/chatRoulette/QueuePanel";
import RulesPanel from "~/components/chatRoulette/RulesPanel";
import { Alert } from "@mui/material";

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
  const [isQueue, setIsQueue] = useState<boolean>(chatStatus === "Paired" ? false : true);
  const [firstTime, setFirstTime] = useState<boolean>(true);

  useEffect(() => {
    if (session.status === "loading") return;
    if (!session?.data?.user) router.replace("/");
  }, [session.status, session, session.data]);

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

  const isQuery = useQuery(IS_QUEUE, {
    variables: {
      token: session.data?.token as string,
    },
    onCompleted: ({ queuePosition }) => {
      console.log("queuePosition COMPLETED=", queuePosition);
      if (queuePosition.position === 0 && chatStatus !== "Paired") {
        setIsQueue(true);
      }
    },
  });

  // UseEffect for checking query status

  useEffect(() => {
    if (isQuery.loading) {
      console.log("loading...");
    } else if (isQuery.error) {
      console.log("error", +isQuery.error.message);
    } else {
      console.log("queuePosition COMPLETED=", isQuery.data.queuePosition);
    }
  }, [isQuery]);

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

  const startChat = async () => {
    await initiateChat();
    if (chatStarted.data) {
      console.log("chatStarted.data=", chatStarted.data);
    }
  };

  const handleStartQueue = async () => {
    console.log("isQuery", isQuery);
    if (isQuery.loading) {
      return;
    }
    const isQueuePosition = isQuery.data.queuePosition.position;

    if (isQueuePosition > 0) {
      console.log(isQuery.data?.queuePosition);
    } else {
      console.log(isQueuePosition);
      setIsQueue(true);
      await startChat();
      setFirstTime(false);
    }
  };

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

  const handleNextUser = () => {
    initiateChat();
  };

  const handleBack = () => {
    dequeueUser().then(() => {
      console.log(isQuery.data?.queuePosition);
      setFirstTime(true);
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
    if (chatStatus === "Paired") {
      setFirstTime(false);
      setTimeout(function () {
        setIsQueue(false);
      }, 2000); // 5000 milliseconds (5 seconds)
    }
  }, [chatStatus, isQuery]);

  if (session?.data?.user) {
    return (
      <>
        <Head>
          <title>Edugle</title>
          <meta name="chat" content="Chatroom" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main style={{}} className="min-w-screen z-10 mt-6 bg-gradient-to-b to-[#2C7DA0] text-white">
          {firstTime ? (
            <RulesPanel handleStartQueue={handleStartQueue} handleBack={handleBack} />
          ) : isQueue ? (
            <QueuePanel handleBack={handleBack} chatStatus={chatStatus} />
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
                </div>
              </div>
            </Paper>
          )}
        </main>
      </>
    );
  }
};
export default ChatApp;
