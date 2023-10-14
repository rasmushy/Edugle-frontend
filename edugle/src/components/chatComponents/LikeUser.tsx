"use client";
import React, { useState } from "react";
import { Modal } from "@mui/material";
import { set } from "zod";
import { gql, useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";

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

const LikeUser = ({ isPopUpOpen, setIsPopUpOpen, user }: any) => {
  const session = useSession();
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
    setIsPopUpOpen(false);
    setIsOpen(false);
  }

  async function handleDislikeUser(id: any): Promise<void> {
    dislikeUser();
    setIsPopUpOpen(false);
    setIsOpen(false);
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
