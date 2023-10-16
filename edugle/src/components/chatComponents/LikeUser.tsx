import React from "react";
import { Modal } from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";
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

const GET_USER = gql`
  query Query($getUserByIdId: ID!) {
    getUserById(id: $getUserByIdId) {
      id
      username
      email
      description
      avatar
      likes
    }
  }
`;

const LikeUser = ({ isPopUpOpen, setIsPopUpOpen, userId }: any) => {
  const session = useSession();
  const { data, refetch } = useQuery(GET_USER, {
    variables: {
      getUserByIdId: userId,
    },
    skip: !isPopUpOpen,
  });

  const [likeUser] = useMutation(LIKE_USER, {
    variables: {
      username: data?.getUserById?.username,
      token: session.data?.token as string,
    },
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.log("likeUser: error=", error.message);
    },
  });

  const [dislikeUser] = useMutation(DISLIKE_USER, {
    variables: {
      username: data?.getUserById?.username,
      token: session.data?.token as string,
    },
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.log("likeUser: error=", error.message);
    },
  });

  async function handleLikeUser(): Promise<void> {
    likeUser();
    handleClose();
  }

  async function handleDislikeUser(): Promise<void> {
    dislikeUser();
    handleClose();
  }

  const handleClose = () => {
    setIsPopUpOpen(false);
  };

  return (
    <Modal key={isPopUpOpen ? "open" : "closed"} open={isPopUpOpen} onClose={handleClose}>
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
          <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Profile of {data?.getUserById.username}</h1>
        </header>
        <p style={{ color: "black", marginBottom: "20px" }}>{data?.getUserById.description ? data?.getUserById.description : "No description yet!"}</p>
        <p style={{ color: "black", marginBottom: "20px" }}>Likes: {data?.getUserById.likes}</p>

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
            onClick={() => handleDislikeUser()}
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
            onClick={() => handleLikeUser()}
          >
            Like
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LikeUser;
