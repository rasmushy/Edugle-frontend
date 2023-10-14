import React, { use, useEffect, useRef, useState } from "react";
import { Message, Chat, User } from "../__generated__/graphql";
import styles from "../styles/styles.module.css";
import Asd from "./HoverUserInfo";
import HoverUserInfo from "./HoverUserInfo";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import LikeUser from "./LikeUser";

type ChatMessagesProps = {
  chatMessages: Message[];
  yourUsername: string | undefined | null;
};

//Adds breaks to long messages, so they don't overflow the chat box.
//Adds newlines when user presses shift+enter.
function addBreaks(str: string) {
  const interval = 52;
  const lines = str.split("\n");
  const processedLines = lines.map((line) => {
    let newStr = "";
    for (let i = 0; i < line.length; i++) {
      if (i > 0 && i % interval === 0) {
        newStr += "\u200B";
      }
      newStr += line[i];
    }
    return newStr;
  });
  return processedLines;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ chatMessages: messages, yourUsername: yourUsername }) => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isUserSelf, setIsYou] = useState(false);
  const [dsa, setUserInfo] = useState<User | null>(null);
  const [activeUserMessage, setActiveUserMessage] = useState<number | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const handleOpen = () => {
    console.log(isPopUpOpen, " IsClose");
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      style={{ overflow: "auto" }}
      ref={messagesContainerRef}
      className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch max-h-[390px] min-h-[70vh] space-y-4 space-y-4 "
    >
      <div className={styles.glassPanel}>
        {isPopUpOpen && !isUserSelf && <LikeUser isPopUpOpen={isPopUpOpen} setIsPopUpOpen={setIsPopUpOpen} user={dsa} />}
        {messages &&
          messages.map((message: Message, index: number) => {
            const isYou = message.sender?.username === yourUsername;
            const isMessageActive = index === activeUserMessage;

            const messageContainerClass = isYou
              ? "order-2 flex max-w-xs flex-col items-end space-y-2 text-lg mb-5 ml-auto mr-5"
              : "order-2 flex max-w-xs flex-col items-start space-y-2 text-lg mb-5 ml-5 ";

            const messageTextClass = isYou
              ? "inline-block rounded-lg rounded-br-none bg-gray-300 px-4 py-2 text-gray-600"
              : "inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600";

            return (
              <div key={message?.id} className={`${messageContainerClass}`}>
                <strong
                  onClick={() => {
                    setUserInfo(message.sender);
                    setIsPopUpOpen(true);
                    setIsYou(isYou);
                    setActiveUserMessage(isMessageActive ? null : index);
                  }}
                  style={{ color: "#ccdbdc", cursor: "pointer", userSelect: "none", pointerEvents: isYou ? "none" : "auto" }}
                >
                  {message?.sender?.username}:
                </strong>

                {isMessageActive}

                <span className={`${messageTextClass}`}>
                  {addBreaks(message.content).map((line, lineIndex) => (
                    <span key={lineIndex}>
                      {line}
                      {lineIndex < message.content.length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default ChatMessages;
