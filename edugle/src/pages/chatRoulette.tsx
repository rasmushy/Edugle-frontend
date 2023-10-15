import React, { useState, useEffect } from "react";
import Head from "next/head";
import ChatMessages from "../components/chatComponents/ChatMessages";
import ChatBox from "../components/chatComponents/ChatBox";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useSession } from "next-auth/react";
import type { Message } from "../__generated__/graphql";
import { useRouter } from "next/navigation";
import Paper from "@mui/material/Paper";
import OceanImage from "../../public/images/ocean.jpg";
import styles from "../styles/styles.module.css";
import QueuePanel from "~/components/chatRoulette/QueuePanel";
import RulesPanel from "~/components/chatRoulette/RulesPanel";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavBar } from "~/components/navBar/NavBarProvider";

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

const SUBSCRIPTION_CHAT = gql`
  subscription UpdatedChat($userId: ID!) {
    updatedChat(userId: $userId) {
      eventType
      timestamp
      message
      chat {
        created_date
        id
        messages {
          id
          date
          content
          sender {
            description
            avatar
            id
            likes
            username
          }
        }
        users {
          id
          username
          avatar
          description
        }
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

const JOIN_CHAT = gql`
  mutation JoinChat($chatId: ID!, $userToken: String!) {
    joinChat(chatId: $chatId, userToken: $userToken) {
      created_date
      id
      messages {
        content
        date
        id
        sender {
          id
          email
          username
        }
      }
      users {
        id
      }
    }
  }
`;

const LEAVE_CHAT = gql`
  mutation LeaveChat($chatId: ID!, $userToken: String!) {
    leaveChat(chatId: $chatId, userToken: $userToken) {
      created_date
      id
      users {
        id
      }
      messages {
        content
        id
        date
        sender {
          id
        }
      }
    }
  }
`;

const IS_QUEUE = gql`
  query QueuePosition($token: String!) {
    queuePosition(token: $token) {
      position
      status
    }
  }
`;

const ChatApp = () => {
  const session = useSession();
  const router = useRouter();
  const { isNavBarOpen, openNavBar, closeNavBar } = useNavBar();
  const [chatId, setChatId] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatStatus, setChatStatus] = useState("");
  const [isQueue, setIsQueue] = useState<boolean>(chatStatus === "Paired" ? false : true);
  const [firstTime, setFirstTime] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState(false);
  const [userLeftChat, setUserLeftChat] = useState(false);

  useEffect(() => {
    if (session.status === "loading") return;
    if (!session?.data?.user) router.replace("/");
  }, [session.status, session, session.data]);

  useSubscription(SUBSCRIPTION_CHAT, {
    variables: { userId: session.data?.user.id },
    onSubscriptionData: ({
      subscriptionData: {
        data: { updatedChat },
      },
    }) => {
      switch (updatedChat.eventType) {
        case "CHAT_STARTED":
          setChatId(updatedChat.chat.id);
          setChatStatus("Paired");
          setOtherUser(
            updatedChat.chat.users[0].username === session?.data?.user.username ? updatedChat.chat.users[1].username : updatedChat.chat.users[0].username,
          );
          setFirstTime(false);
          setUserLeftChat(false);
          setMessages([]);
          setTimeout(function () {
            setIsQueue(false);
          }, 1000);
          break;
        case "USER_JOINED_CHAT":
          if (updatedChat.chat.users[0].username === session?.data?.user.username) {
            setOtherUser(updatedChat.chat.users[1].username);
          } else {
            setOtherUser(updatedChat.chat.users[0].username);
          }
          break;
        case "USER_LEFT_CHAT":
          const userLeftMessage = {
            id: ("00001" + session.data?.user.id) as string,
            content: `${updatedChat.message}`,
            date: updatedChat.timestamp,
            sender: {
              id: ("00002" + session.data?.user.id) as string,
              username: "Edugle",
              email: "edugle@render.com",
            },
          };
          if (!userLeftChat) {
            setMessages((prevMessages) => [...prevMessages, userLeftMessage]);
          }
          setUserLeftChat(true);
          break;
        case "USER_SENT_MESSAGE":
          setMessages((prevMessages) => [...prevMessages, updatedChat.chat.messages[updatedChat.chat.messages.length - 1]]);
          break;
        default:
          break;
      }
    },
    onError: (error) => {
      console.log("SUBSCRIPTION_CHAT: error=", error);
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
      setChatStatus(initiateChat.status);
      if (initiateChat.status === "Paired") {
        setChatId((prevChatId) => {
          if (prevChatId !== "") {
            return initiateChat.chatId;
          }
          return prevChatId;
        });
        if (chatId !== "") {
          joinChat();
        }
      }
    },
    onError: (error) => {
      console.log("initiateChat: error=", error.message);
    },
  });
  const [joinChat] = useMutation(JOIN_CHAT, {
    variables: {
      chatId: chatId,
      userToken: session.data?.token as string,
    },
    onError: (error) => {
      console.log("joinChat: error=", error);
    },
  });

  const [leaveChat] = useMutation(LEAVE_CHAT, {
    variables: {
      chatId: chatId,
      userToken: session.data?.token as string,
    },
    onCompleted: ({ leaveChat }) => {
      setChatId("");
    },
    onError: (error) => {
      console.log("leaveChat: error=", error);
    },
  });

  const handleStartQueue = () => {
    if (isQuery.loading) {
      return;
    }
    const isQueuePosition = isQuery.data.queuePosition.position;
    if (isQueuePosition != 0) {
      //console.log(isQuery.data?.queuePosition);
    } else {
      setIsQueue(true);
      initiateChat();
      setFirstTime(false);
    }
  };

  const handleNextUser = () => {
    if (isQuery.loading) {
      return;
    }

    const isQueuePosition = isQuery.data.queuePosition.position;

    if (isQueuePosition != 0) {
      isQuery.refetch();
    } else {
      if (chatStatus === "Paired") {
        setOtherUser(null);
        leaveChat().then(() => {
          setIsQueue(true);
          setTimeout(() => {
            initiateChat();
          }, 2000);
          setFirstTime(false);
        });
      } else if (chatStatus === "Queue") {
        setChatId("");
      }
    }
  };

  useEffect(() => {
    if (chatId) {
      setChatStatus("Paired");
    }
  }, [chatId]);

  const handleBack = () => {
    closeNavBar();
    dequeueUser().then(() => {
      setFirstTime(true);
      router.replace("/");
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const boxShadowStyle = isHovered
    ? {}
    : {
        boxShadow: "0px 0px 10px 1px rgba(0, 0, 0, 0.4)",
      };
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
              elevation={3}
              sx={{
                borderRadius: 5,
                margin: 0,
                marginLeft: "20px",
                marginRight: "20px",
                padding: 0,
                boxShadow: "0px 0px 10px 10px rgba(0, 0, 0, 0.4)",
                position: "relative",
                overflow: "hidden",
                backgroundColor: "white",
                backgroundImage: `url(${OceanImage.src})`,
              }}
            >
              <div className="flex-row">
                <div className="flex-col" style={{ top: "3%", position: "relative" }}>
                  {/* Chat messages1 */}
                  {chatId != "" && <ChatMessages chatMessages={messages} yourUsername={session?.data?.user.username} style={"roulette"} />}

                  {/* Chat box1 */}
                  <ChatBox chatId={chatId} user={session.data?.token as string} userLeftChat={userLeftChat} />
                  <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", height: "60px" }}>
                    <CircleIcon style={{ color: userLeftChat ? "red" : "green", marginLeft: "20px", marginRight: "20px" }} />
                    <h1>
                      Talking to: <strong>{otherUser}</strong>
                    </h1>
                    <div
                      className={styles.nextUserButton}
                      onClick={handleNextUser}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        borderRadius: "10px 10px 0px 10px",
                        backgroundColor: "#ef476f",
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "auto",
                        marginRight: "20px",
                        width: "120px",
                        cursor: "pointer",
                        height: "40px",
                        transition: "box-shadow 0.3s",
                        ...boxShadowStyle,
                      }}
                    >
                      <h1 className={styles.nextUserText} style={{ width: "100%", marginLeft: "20px", color: "black", cursor: "pointer" }}>
                        Next user!{" "}
                      </h1>
                    </div>
                  </div>
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
