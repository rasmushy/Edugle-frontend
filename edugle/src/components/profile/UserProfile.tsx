import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { gql } from "@apollo/client";
import styles from "../../styles/styles.module.css";
import { useSession } from "next-auth/react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";

const GET_USER = gql`
  query GetUserByToken($token: String!) {
    getUserByToken(token: $token) {
      description
      username
      email
      id
      likes
    }
  }
`;

const UPDATE_USER = gql`
  mutation ModifyUser($user: modifyUserInput) {
    modifyUser(modifyUser: $user) {
      message
      user {
        description
      }
    }
  }
`;

export default function Profile() {
  const session = useSession();
  const [userName, setUserName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [, setUserEmail] = useState<string>("");
  const [likeCount, setLikes] = useState<string>("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useQuery(GET_USER, {
    variables: {
      token: session.data?.token as string,
    },
    onCompleted: ({ getUserByToken }) => {
      setUserName(getUserByToken.username);
      setDescription(getUserByToken.description);
      setUserEmail(getUserByToken.email);
      setLikes(getUserByToken.likes);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    variables: {
      user: {
        token: session.data?.token as string,
        description: description,
      },
    },
    onCompleted: ({ }) => {
      //console.log("modifyUser", modifyUser);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  if (session.status === "authenticated") {
    return (
      <>
        <div
          style={{
            height: "92.5vh", // Change from "95vh" to "100vh"
            margin: 0,
            padding: 0,
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
          </div>
          <Dialog open={isPopupOpen} onClose={() => setIsPopupOpen(false)} sx={{ height: "100%" }}>
            <DialogTitle>Edit Description</DialogTitle>
            <DialogContent>
              <TextField fullWidth value={description} onChange={(e) => setDescription(e.target.value)} />
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
            className={styles.profile}
            style={{
              borderRadius: 25,
              height: "80vh",
              display: "flex",
              width: "80%",
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

            <Avatar className={styles.avatar} sx={{ width: 200, height: 200, marginBottom: 10 }} />
            <Typography variant="h3" component="div" sx={{ marginTop: 1 }}>
              {userName}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                textAlign: "center",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              Liked by {likeCount} others
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                textAlign: "center",
                maxWidth: "80%",
                mt: 2,
                marginTop: 6,
                fontSize: "1.3rem",
              }}
            >
              Description:
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                textAlign: "center",
                maxWidth: "80%",
                mt: 2,
                fontSize: "1.3rem",
              }}
            >
              {description ? description : "No description yet!"}
            </Typography>
          </Paper>
        </div>
      </>
    );
  }
}

