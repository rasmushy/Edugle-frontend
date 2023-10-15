"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { set } from "zod";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { get } from "http";

const LIKE_USER = gql`
  mutation LikeUser($username: String!, $token: String) {
    addLike(username: $username, token: $token)
  }
`;

const DISLIKE_USER = gql`
  mutation DislikeUser($username: String!, $token: String) {
    removeLike(username: $username, token: $token)
  }
`;

const GET_USER = gql`
  query Query($getUserByIdId: ID!) {
  getUserById(id: $getUserByIdId) {
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
`;

const LikeUser = ({ isPopUpOpen, setIsPopUpOpen, userId }: any) => {

  const {data, refetch, updateQuery} = useQuery(GET_USER, {
    variables: {
      getUserByIdId: userId,
    }
  });

  const session = useSession();

  const [user, setUser] = useState([] as any);

  useEffect(() => {
    if(isPopUpOpen) {
      if(data) {
        setUser(data.getUserById);
      }
    }
  }, [isPopUpOpen]);

  const [likeUser] = useMutation(LIKE_USER, {
    variables: {
      username: user.username as string,
      token: session.data?.token as string,
    },
    onCompleted: ({ likeUser }) => {
      console.log("likeUser=", likeUser, user);
    },
    onError: (error) => {
      console.log("likeUser: error=", error.message);
    }
  });

  const [dislikeUser] = useMutation(DISLIKE_USER, {
    variables: {
      username: user.username as string,
      token: session.data?.token as string,
    },
    onCompleted: ({ dislikeUser }) => {
      console.log("dislikeUser=", dislikeUser, user);
    },
    onError: (error) => {
      console.log("likeUser: error=", error.message);
    },
  });

  const [isOpen, setIsOpen] = useState(isPopUpOpen);

  async function handleLikeUser(id: any): Promise<void> {
    likeUser();
    updateQuery((prev: any) => {
      return {
        getUserById: {
          ...prev.getUserById,
          likes: prev.getUserById.likes + 1,
        }
      }
    });
    handleClose();

  }

  async function handleDislikeUser(id: any): Promise<void> {
    dislikeUser();
      updateQuery((prev: any) => {
        return {
          getUserById: {
            ...prev.getUserById,
            likes: prev.getUserById.likes - 1,
          }
        }
      });
    handleClose();
  }

  const handleClose = () => {
    setIsPopUpOpen(false);
    setIsOpen(false);
  };
  console.log("isPopUpOpen:", isPopUpOpen);

  return (
    <Modal key={isPopUpOpen ? "open" : "closed"} open={isOpen} onClose={handleClose}>
      <div
        style={{
          position: "absolute",
          minWidth: "300px",
          height: "300px",
          backgroundColor: "white",
          border: "2px solid", // Added "solid" for border style
          boxShadow: "5px 5px 3px gray",
          padding: "20px",
          borderRadius: "10px",
          top: `${50}%`,
          left: `${50}%`,
          transform: `translate(-${50}%, -${50}%)`,
          textAlign: "center", // Center text
        }}
      >
        <header style={{ color: "black" }}>
          <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Käyttäjän {user.username} profiili!</h1>
        </header>
        <p style={{ color: "black", marginBottom: "20px" }}>{user.description ? user.description : "No description yet!"}</p>
        <p style={{ color: "black", marginBottom: "20px" }}>Likes: {user.likes}</p>

        <div style={{ position: "absolute", bottom: "20px", left: "20%" }}>
          <button
            style={{
              fontSize: "16px",
              padding: "10px 20px",
              background: "#E53E3E",
              color: "white", // Text color
              border: "none",
              borderRadius: "5px",
              marginRight: "10px", // Add a gap
            }}
            onClick={() => handleDislikeUser(user.id)}
          >
            Dislike
          </button>
          <button
            style={{
              fontSize: "16px",
              padding: "10px 20px",
              background: "#014F86",
              color: "white", // Text color
              border: "none",
              borderRadius: "5px",
            }}
            onClick={() => handleLikeUser(user.id)}
          >
            Like
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LikeUser;
