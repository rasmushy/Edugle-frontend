import React from "react";
import type { User } from "../__generated__/graphql";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

type ChatBarProps = {
  chatId: string;
  user: string;
  chatStatus: string;
  handleLikeUser: () => void;
  handleNextUser: () => void;
};

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
          likes
        }
      }
      users {
        username
        id
      }
    }
  }
`;

const LEAVE_CHAT = gql`
  mutation LeaveChat($chatId: ID!, $token: String!) {
    leaveChat(chatId: $chatId, token: $token) {
      created_date
      id
      messages {
        content
        date
        id
        sender {
          id
          username
          likes
        }
      }
      users {
        username
        id
      }
    }
  }
`;

const ChatBar: React.FC<ChatBarProps> = ({
  chatId,
  user,
  chatStatus,
  handleLikeUser,
  handleNextUser,
}) => {
  const [users, setUsers] = useState<User[]>([]);

  const [joinChat] = useMutation(JOIN_CHAT, {
    variables: {
      chatId: chatId,
      token: user,
    },
    onCompleted: ({ joinChat }) => {
      console.log("joinChat=", joinChat);
      setUsers(joinChat.users as User[]);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const [leaveChat] = useMutation(LEAVE_CHAT, {
    variables: {
      chatId: chatId,
      token: user,
    },
    onCompleted: ({ leaveChat }) => {
      console.log("leaveChat=", leaveChat);
      setUsers([]);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  useEffect(() => {
    if (chatStatus === "Queue") {
      if (chatId !== "") {
        leaveChat();
      }
      console.log("Still in queue");
    } else if (chatStatus === "Paired") {
      console.log("Paired with chatId:", chatId);
      joinChat();
    } 
  }, [chatStatus]);

  return (
    <div className="relative">
      <div className="flex flex-row bg-white/10 pb-4 pl-4 pr-4">
        {users.map((user, idx) => (
          <div
            key={idx}
            className="space-evenly mt-2 flex flex-row items-center text-center text-white"
          >
            <h3 className="w-full text-xl font-bold">{user?.username}</h3>
            <p className="w-full">{user?.description}</p>
            <img
              alt={`${user?.username}'s avatar`}
              src={user?.avatar || "/default-avatar.png"}
              className="ml-8 h-16 w-16 rounded-full"
            />
          </div>
        ))}

        <div className="absolute bottom-0 right-0 flex h-full items-center pr-2">
          <button
            onClick={handleLikeUser}
            className="mx-1 rounded bg-[hsl(280,100%,70%)] p-2 text-white"
          >
            Like
          </button>
          <button
            onClick={handleNextUser}
            className="mx-1 rounded bg-[hsl(280,100%,70%)] p-2 text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBar;
