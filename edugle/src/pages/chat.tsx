import React, { useState, useEffect, use } from "react";
import Head from "next/head";
import ChatMessages from "../components/ChatMessages";
import ChatBox from "../components/ChatBox";
import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import LikeUser from "~/components/LikeUser";
import { useSession } from "next-auth/react";
import type { Message } from "../__generated__/graphql";
import { useRouter } from "next/navigation";
import Paper from "@mui/material/Paper";
import OceanImage from "../../public/images/asd.jpg";


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
          likes
          description
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

const MSG_BY_ID = gql`
  query Messages($chatByIdId: ID!) {
  chatById(id: $chatByIdId) {
    messages {
      id
      date
      content
      sender {
        id
        username
        email
        password
        description
        avatar
        lastLogin
        role
        likes
      }
    }
    created_date
    id
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
  const [chatId, setChatId] = useState("651fe685a4cdf622986a9f14");
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
  
  const x = useQuery(MSG_BY_ID, { variables: { chatByIdId: "651fe685a4cdf622986a9f14" }, 
          onCompleted: (data) => { console.log(data); return data} });
  useEffect(() => {
    if (!x.data) {
      return;
    }
    setMessages(x.data.chatById.messages as Message[])
  },[x]);

  useEffect(() => {
    if (!messageCreated.data) {
      return;
    }
    console.log("messageCreated.data=", messageCreated.data);
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
                {chatId != "" && <ChatMessages chatMessages={messages} yourUsername={session?.data?.user.username} />}

                {/* Chat box */}
                <ChatBox chatId={chatId} user={session.data?.token as string} />

                {isLikeUser && <LikeUser isLikeUser={isLikeUser} setIsLikeUser={setIsLikeUser} />}
                {/* Sidebar: with functions for liking and joining next chat */}
                {/*  <ChatBar chatId={chatId} user={token} chatStatus={chatStatus} handleLikeUser={handleLikeUser} handleNextUser={handleNextUser} />*/}
              </div>
            </div>
          </Paper>
      </main>
    </>
  );
};
export default ChatApp;
