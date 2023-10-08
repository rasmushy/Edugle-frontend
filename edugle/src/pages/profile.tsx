import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import { useMutation, useQuery } from "@apollo/client";
import React, { PropsWithRef, use, useEffect, useRef, useState } from "react";
import { gql } from "@apollo/client";
import styles from "../styles/styles.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const GET_USER = gql(`query GetUserByToken($token: String!) {
    getUserByToken(token: $token) {
        description
        username
        email
        id
  }
}`);
export default function Profile() {
  const session = useSession();
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const bubblesContainerRef = useRef<HTMLDivElement | null>(null);
  const likeCount = 42;

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/");
    }
  }, [session]);

  const getUser = useQuery(GET_USER, {
    variables: {
      token: token,
    },

    onCompleted: ({ getUserByToken }) => {
      setUserName(getUserByToken.username);
      setDescription(getUserByToken.description);
      setUserEmail(getUserByToken.email);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const getUserQuery = async () => {
    const token = session.data?.user?.token;
    if (token) {
      setToken(token);
      await getUser.refetch();
    }
  };

  function createBubbles() {
    const bubbles = bubblesContainerRef.current;
    if (bubbles) {
      const bottom = window.innerHeight;
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const bubble = document.createElement("div");
          const delay = Math.random() * -100;
          const duration = Math.random() * 10 + 3;
          const posX = Math.random() * bubbles.clientWidth;
          const posY = bottom;

          bubble.style.left = `${posX}px`;
          bubble.style.bottom = `-${posY}px`; // Negative value to start from the bottom

          bubble.className = `${styles.bubble}`;
          bubble.style.animationDelay = `${delay}s`;
          bubble.style.animationDuration = `${duration}s`;

          bubbles.appendChild(bubble);
        }, i * 1000);
      }
    }
  }

  useEffect(() => {
    getUserQuery();
  });

  useEffect(() => {
    createBubbles();
  }, []);

  if (session.status === "authenticated") {
    return (
      <>
        <div
          style={{
            height: "92.5vh", // Change from "95vh" to "100vh"
            margin: 0, // Add this to remove any margin
            padding: 0, // Add this to remove any padding
          }}
          className="flex max-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#89C2D9] to-[#012A4A]"
        >
          <div
            style={{
              position: "absolute",
              overflow: "hidden",
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <div ref={bubblesContainerRef}></div>
          </div>
          <Paper
            elevation={3}
            style={{
              borderRadius: 25,
              height: "80vh",
              display: "flex",
              width: "60%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              backgroundColor: "white",
            }}
          >
            <Avatar
              alt="Aser Avatar"
              src="/path/to/user-avatar.png"
              sx={{ width: 200, height: 200, marginBottom: 10 }}
            />
            <Typography variant="h3" component="div" sx={{ marginTop: 1 }}>
              {userName}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                textAlign: "center",
                fontSize: "1.5rem", // Increase font size
                fontWeight: "bold", // Add bold styling
              }}
            >
              Liked by {likeCount} others
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                textAlign: "center", // Center text on all screen sizes
                maxWidth: "80%", // Limit text width on smaller screens
                mt: 2, // Add top margin to separate bio from username
                marginTop: 6,
                fontSize: "1.3rem", // Increase font size
              }}
            >
              {description}
            </Typography>
          </Paper>
        </div>
      </>
    );
  }
}
