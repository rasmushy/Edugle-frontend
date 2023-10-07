import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import { useMutation, useQuery } from "@apollo/client";
import React, { PropsWithRef, useEffect, useState } from "react";
import { gql } from "@apollo/client";

const GET_USER = gql(`query GetUserByToken($token: String!) {
    getUserByToken(token: $token) {
        description
        username
        email
        id
  }
}`);
const profile = () => {
  const [token, setToken] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const likeCount = 42;

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
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      await getUser.refetch();
    }
  };

  useEffect(() => {
    getUserQuery();
  });

  return (
    <>
      <div
        style={{
          height: "92.5vh", // Change from "95vh" to "100vh"
          margin: 0, // Add this to remove any margin
          padding: 0, // Add this to remove any padding
        }}
        className="flex max-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]"
      >
        <Paper
          elevation={3}
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
};

export default profile;
