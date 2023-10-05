import React, { useEffect, useRef } from "react";
import { Message } from "../__generated__/graphql";

type ChatMessagesProps = {
  messages: Message[];
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

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" }); //scrolls to bottom of chat box
    }
  }, [messages]);

  return (
    <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch max-h-[390px] min-h-[390px] space-y-4  space-y-4 overflow-x-hidden overflow-y-scroll bg-white/10 p-3 p-3">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className="order-2 flex max-w-xs flex-col items-start space-y-2 text-xs"
        >
          <strong>{msg.sender.username}:</strong>
          <span className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600">
            {addBreaks(msg.content).map((line, lineIndex) => (
              <span key={lineIndex}>
                {line}
                {lineIndex < msg.content.length - 1 && <br />}
              </span>
            ))}
          </span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
export default ChatMessages;
