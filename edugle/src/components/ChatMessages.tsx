import React, { use, useEffect, useRef } from "react";
import { Message, Chat } from "../__generated__/graphql";
import styles from "../styles/styles.module.css";

type ChatMessagesProps = {
  chatMessages: Message[];
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

const ChatMessages: React.FC<ChatMessagesProps> = ({
  chatMessages: messages,
}) => {
  return (
    <div
      style={{ borderRadius: "20px 20px 0 0"}}
      className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch overflow-x- max-h-[390px] min-h-[70vh]  space-y-4 space-y-4 "
    >
      <div className={styles.glassPanel}>
        {messages &&
          messages.map((message: Message) => {
            return (
              <div key={message?.id} className="order-2 flex max-w-xs flex-col items-start space-y-2 text-xs">
                <strong>{message?.sender?.username}:</strong>
                <span className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600">
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
