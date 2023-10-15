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
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import { set } from "zod";
import { init } from "@graphql-codegen/cli";
import { StackedLineChartOutlined } from "@mui/icons-material";
import {url} from "inspector";

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

const IS_QUEUE = gql(`query QueuePosition($token: String!) {
  queuePosition(token: $token) {
    position
    status
  }
}`);

const JOIN_CHAT = gql`
  mutation JoinChat($chatId: ID!, $token: String!) {
    joinChat(chatId: $chatId, token: $token) {
      created_date
      id
      messages {
        content
        date
        id
        sender {
          id
          username
          description
          likes
        }
      }
      users {
        username
        email
        description
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
      messages {
        content
        date
        id
        sender {
          id
          username
          description
          likes
        }
      }
      users {
        username
        email
        description
        id
      }
    }
  }
`;

const ChatApp = () => {
  const session = useSession();
  const router = useRouter();
  const [chatId, setChatId] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatStatus, setChatStatus] = useState("");
  const [isLikeUser, setIsLikeUser] = useState<boolean>(false);
  const [isQueue, setIsQueue] = useState<boolean>(chatStatus === "Paired" ? false : true);
  const [firstTime, setFirstTime] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState(false);

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
          console.log("udpatearouentaoedu", updatedChat);
          setOtherUser(
            updatedChat.chat.users[0].username === session?.data?.user.username ? updatedChat.chat.users[1].username : updatedChat.chat.users[0].username,
          );
          setFirstTime(false);
          setTimeout(function () {
            setIsQueue(false);
          }, 1000);
          console.log("CHAT_STARTED: chatId=", updatedChat.chat.id, ", timestamp=", updatedChat.timestamp);
          break;
        case "USER_JOINED_CHAT":
          /*             const userJoinedMessage = {
            id: ("11111" + session.data?.user.id) as string,
            content: `${updatedChat.message}`,
            date: updatedChat.timestamp,
            sender: {
              id: ("11112" + session.data?.user.id) as string,
              username: "Edugle",
              email: "edugle@render.com",
            },
          };
          setMessages((prevMessages) => [...prevMessages, userJoinedMessage]);  */
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
          setMessages((prevMessages) => [...prevMessages, userLeftMessage]);
          break;
        case "USER_SENT_MESSAGE":
          setMessages((prevMessages) => [...prevMessages, updatedChat.chat.messages[updatedChat.chat.messages.length - 1]]);
          break;
        default:
          console.log("eventType not found", updatedChat.eventType);
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
    onCompleted: ({ queuePosition }) => {
      console.log("queuePosition COMPLETED=", queuePosition);
      if (queuePosition.position === 0 && chatStatus !== "Paired") {
        setIsQueue(true);
      }
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
      setChatStatus(initiateChat.status);
      console.log("initiateChat COMPLETED=", initiateChat);
      if (initiateChat.status === "Paired") {
        setChatId(initiateChat.chatId);
      }
    },
    onError: (error) => {
      console.log("initiateChat: error=", error.message);
      isQuery.refetch();
    },
  });
  const [joinChat] = useMutation(JOIN_CHAT, {
    variables: {
      chatId: chatId,
      token: session.data?.token as string,
    },
    onCompleted: ({ joinChat }) => {
      console.log("joinChat COMPLETED=", joinChat);
    },
    onError: (error) => {
      console.log("joinChat: error=", error);
    },
  });

  const [leaveChat] = useMutation(LEAVE_CHAT, {
    variables: {
      chatId: chatId,
      token: session.data?.token as string,
    },
    onCompleted: ({ leaveChat }) => {
      console.log("leaveChat COMPLETED=", leaveChat);
    },
    onError: (error) => {
      console.log("leaveChat: error=", error);
    },
  });

  // UseEffect for checking query status
/*   useEffect(() => {
    if (isQuery.loading) {
      console.log("loading...");
    } else if (isQuery.error) {
      console.log("error", +isQuery.error.message);
    } else {
      console.log("queuePosition COMPLETED=", isQuery.data.queuePosition);
    }
  }, [isQuery]); */

  /*   useEffect(() => {
    if (chatStatus === "Paired") {
      setFirstTime(false);
      setTimeout(function () {
        setIsQueue(false);
      }, 2000); // 5000 milliseconds (5 seconds) <-- 2000 on 2 sec noob
    }
  }, [chatStatus, isQuery]);
 */
  useEffect(() => {
    if (chatId) {
      console.log("ligma");
      setChatStatus("Paired");
      //setIsQueue(false);
    }
  }, [chatId]);

  const handleStartQueue = () => {
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
      initiateChat();
      setFirstTime(false);
      if (chatId != "") {
        joinChat();
      }
    }
  };

  const handleNextUser = () => {
    // FIXME: jättää toisel selaimella auki ton queue panelin, ja ku tabaa pois ja sisää nii tajuu et mähä oon paired.
    if (chatStatus === "Paired") {
      setMessages([]);
      setChatId("");
      setChatStatus("Ended");
      setOtherUser(null);
      leaveChat();
    }
    handleStartQueue();
  };

  const handleBack = () => {
    dequeueUser().then(() => {
      setFirstTime(true);
      router.replace("/")
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
        boxShadow: "0px 0px 10px 5px rgba(0, 0, 0, 0.4)",
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
                  <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", height: "60px" }}>
                    <CircleIcon style={{ color: "green", marginLeft: "20px", marginRight: "20px" }} />
                    <h1>
                      Talking to: <strong>{otherUser}</strong>
                    </h1>
                    <div
                      onClick={handleNextUser}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        borderRadius: "10px 10px 0px 10px",
                        backgroundColor: "#A9D6E5",
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "auto",
                        marginRight: "20px",
                        width: "120px",
                        cursor: "pointer",
                        height: "40px",
                        transition: "box-shadow 0.3s", // Add a transition for smooth effect
                        ...boxShadowStyle, // Apply boxShadow based on state
                      }}
                    >
                      <h1 style={{ marginLeft: "20px", color: "black", marginRight: "20px", cursor: "pointer" }}>Next user! </h1>
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
