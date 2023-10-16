import React, { useEffect, useRef, useState } from "react";
import type { Message, User } from "../../__generated__/graphql";
import styles from "../../styles/styles.module.css";
import LikeUser from "./LikeUser";

type ChatMessagesProps = {
  chatMessages: Message[];
  yourUsername: string | undefined | null;
  style?: string;
};

function addBreaks(str: string) {
  //Adds breaks to long messages, so they don't overflow the chat box.
  const interval = 52;
  // This regular expression will match every 'interval' characters that are not line breaks.
  const regex = new RegExp(`(.{1,${interval}})(?!$)`, "g");
  return str.replace(regex, "$1\u200B").split("\n");
}

const  ChatMessages: React.FC<ChatMessagesProps> = ({ chatMessages: messages, yourUsername: yourUsername, style }) => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isUserSelf, setIsYou] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [activeUserMessage, setActiveUserMessage] = useState<number | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      style={{ overflow: "auto" }}
      ref={messagesContainerRef}
      className={style === "roulette" ? styles.rouletteChatMessagesContainer : styles.chatMessagesContainer}
    >
      <div className={style === "roulette" ? styles.rouletteGlassPanel : styles.glassPanel}>
        {isPopUpOpen && !isUserSelf && <LikeUser isPopUpOpen={isPopUpOpen} setIsPopUpOpen={setIsPopUpOpen} userId={userInfo?.id as String} />}
        {messages &&
          messages.map((message: Message, index: number) => {
            const isYou = message.sender?.username === yourUsername || message.sender?.username === "Edugle";
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
