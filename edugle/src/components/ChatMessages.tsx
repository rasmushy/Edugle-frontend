import React, { useEffect, useRef } from "react";
import { useSubscription, gql } from "@apollo/client";
import { IMessage } from "../lib/types";
import { Message } from "../__generated__/graphql";
import { useState } from "react";
import { Chat } from "../__generated__/graphql";

type ChatMessagesProps = {
  chat: Chat;
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

const MESSAGE_CREATED = gql(`subscription Subscription($chatId: ID!) {
  messageCreated(chatId: $chatId) {
    created_date
    id
    messages {
      content
      date
      id
      sender {
        avatar
        description
        email
        id
        lastLogin
        password
        role
        username
      }
    }
  }
}`);

const ChatMessages: React.FC<ChatMessagesProps> = ({ chat }) => {

  const messageCreated = useSubscription(MESSAGE_CREATED, {
    variables: { chatId: chat.id },
    onSubscriptionData: ({ client, subscriptionData }) => {
      console.log("subscriptionData=", subscriptionData);
    }, onError: (error) => {
      console.log("error=", error);
    }
  });

  if (!chat.messages) {
    console.log("chat.messages=", chat.messages);
    return;
  }

  return (
    <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch max-h-[390px] min-h-[70vh] space-y-4  space-y-4 overflow-x- overflow-y-scroll bg-white/10 p-3 p-3">
      {messageCreated.data?.messageCreated.messages.map((message: Message) => {
        if (!message) {
          return null;
        }
        const { id, content, sender, date } = message;
        return (
          <div
            key={id}
            className="order-2 flex max-w-xs flex-col items-start space-y-2 text-xs"
          >
            <strong>{sender?.username}:</strong>
            <span className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600">
              {addBreaks(content).map((line, lineIndex) => (
                <span key={lineIndex}>
                  {line}
                  {lineIndex < content.length - 1 && <br />}
                </span>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
};
export default ChatMessages;
