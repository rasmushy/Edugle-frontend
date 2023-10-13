"use client";
import React, { useState } from "react";
import {
  Modal,
} from "@mui/material";


const CreateUserPopUp = ({ isPopUpOpen, setIsPopUpOpen, user }: any) => {

  function handleLikeUser(id: any): void {
    throw new Error("Function not implemented.");
  }

  function handleDislikeUser(id: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Modal open={isPopUpOpen} onClose={() => setIsPopUpOpen(false)}>
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
        <p style={{ color: "black", marginBottom: "20px" }}>{user.description}</p>
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

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
};

export default CreateUserPopUp;
