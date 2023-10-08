import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";

const GET_USER = gql(`query GetUserByToken($token: String!) {
    getUserByToken(token: $token) {
        description
        username
        email
        id
  }
}`);

const UPDATE_USER = gql(`mutation ModifyUser($user: modifyUserInput) {
  modifyUser(modifyUser: $user) {
    message
    user {
      description
    }
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
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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

  const [updateUser] = useMutation(UPDATE_USER, {
    variables: {
      user: {
        token: token,
        description: description,
      },
    },
    onCompleted: ({ modifyUser }) => {
      console.log("modifyUser", modifyUser);
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
    if (session.status === "authenticated") {
      getUserQuery();
    }
  });

  useEffect(() => {
    createBubbles();
  }, []);

  if (session.status === "loading") {
    return null;
  }

  if (session?.data?.user?.token === undefined) {
    return null;
  }

  if (session.status === "authenticated") {
    return (
      <>
        <div
          style={{
            height: "92.5vh", // Change from "95vh" to "100vh"
            margin: 0, // Add this to remove any margin
            padding: 0, // Add this to remove any padding
            position: "relative",
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
          <Dialog
            open={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            sx={{ height: "100%" }}
          >
            <DialogTitle>Edit Description</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                value={description}
                // Add an onChange handler to update the description
                onChange={(e) => setDescription(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsPopupOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  setIsPopupOpen(false);
                  updateUser();
                }}
                color="primary"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
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
            <IconButton
              onClick={() => setIsPopupOpen(true)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "black",
                zIndex: 1,
              }}
            >
              <EditIcon />
            </IconButton>

            <Avatar
              alt={`${userName.toUpperCase()}.png`}
              src={`${userName}.png`}
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
