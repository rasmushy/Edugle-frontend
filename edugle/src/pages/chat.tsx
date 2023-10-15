import React, { useState, useEffect, use } from "react";
import Head from "next/head";
import ChatMessages from "../components/chatComponents/ChatMessages";
import ChatBox from "../components/chatComponents/ChatBox";
import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import { useSession } from "next-auth/react";
import type { Message } from "../__generated__/graphql";
import { useRouter } from "next/navigation";
import Paper from "@mui/material/Paper";
import OceanImage from "../../public/images/asd.jpg";
import styles from "../styles/styles.module.css";

const SUBSCRIPTION_MESSAGE = gql`
  subscription MessageCreated($chatId: ID!) {
    messageCreated(chatId: $chatId) {
      timestamp
      chatId
      message {
        content
        date
        id
        sender {
          email
          username
          id
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

const ChatApp = () => {
  const session = useSession();
  const router = useRouter();
  const [chatId, setChatId] = useState("651fe685a4cdf622986a9f14");
  const [messages, setMessages] = useState<Message[]>([]);

  if (!session || session.status === "unauthenticated") {
    console.log("ChatApp: session=", session);
    router.push("/");
  }

  const idQuery = useQuery(MSG_BY_ID, {
    variables: { chatByIdId: "651fe685a4cdf622986a9f14" },
    onCompleted: (data) => {
      console.log(data);
      if (data.chatById.messages) {
        setMessages(data.chatById.messages as Message[]);
        setChatId(data.chatById.id);
      }
    },
    onError: (error) => {
      console.log("MSG_BY_ID: error=", error.message);
    },
  });

  useSubscription(SUBSCRIPTION_MESSAGE, {
    variables: { chatId: chatId },
    onSubscriptionData: ({
      subscriptionData: {
        data: { messageCreated, chatId, timestamp },
      },
    }) => {
      console.log("messageCreated: sent at=", timestamp, ", chatId=", chatId, ", sender=", messageCreated.message.sender.username);
      setMessages((prevMessages) => [...prevMessages, messageCreated.message]);
    },
    onError: (error) => {
      console.log("messageCreated: error=", error.message);
    },
  });

  if (session?.data?.user) {
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
            className={styles.slideBackground}
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
              backgroundSize: "auto 100%",
              animation: "slideBackground 20s linear infinite",
            }}
          >
            <div className="flex-row">
              <div className="flex-col" style={{ top: "3%", position: "relative" }}>
                {/* Chat messages */}
                {chatId != "" && <ChatMessages chatMessages={messages} yourUsername={session?.data?.user.username} />}

                {/* Chat box */}
                <ChatBox chatId={chatId} user={session.data?.token as string} />
              </div>
            </div>
          </Paper>
        </main>
      </>
    );
  }
};
export default ChatApp;
