import React from "react";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import SendIcon from "@mui/icons-material/Send";
import styles from "../../styles/styles.module.css";

type ChatBoxProps = {
  chatId: string;
  user: string;
  userLeftChat?: boolean;
};

const CREATE_MESSAGE = gql`
  mutation CreateMessage($chatId: ID!, $message: MessageInput!) {
    createMessage(chatId: $chatId, message: $message) {
      content
      date
      id
      sender {
        username
        email
      }
    }
  }
`;

const ChatBox: React.FC<ChatBoxProps> = ({ chatId, user, userLeftChat }) => {
  const [message, setMessage] = useState("");

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    variables: {
      chatId: chatId,
      message: {
        content: message,
        senderToken: user,
      },
    },
    onError: (error) => {
      //console.log("message that failed=", message);
      console.log("error", error);
    },
  });
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      // Manually handle new lines for shift+enter
      const cursorPosition = e.currentTarget.selectionStart;
      const content = message.substring(0, cursorPosition) + "\n" + message.substring(cursorPosition);
      setMessage(content);

      // Set cursor position right after the inserted newline
      setTimeout(() => {
        if (e.currentTarget) {
          e.currentTarget.selectionStart = cursorPosition + 1;
          e.currentTarget.selectionEnd = cursorPosition + 1;
        }
      }, 0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (message !== "" && chatId !== "") {
      createMessage();
      setMessage("");
    }
  };

  return (
    <div className="max-w-screen min-w-fit">
      <div className="relative" style={{ height: "70px" }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={userLeftChat ? "You are alone..." : "Type your message..."}
          rows={3}
          className={styles.chatBox}
          onKeyDown={handleKeyPress}
          disabled={userLeftChat}
        />
        <div className="absolute bottom-0 right-0 flex h-full items-center pr-2">
          <SendIcon style={{ color: "#012A4A", marginRight: "20px" }} onClick={handleSendMessage} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
