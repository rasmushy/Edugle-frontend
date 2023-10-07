"use client";
import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const inputStyle = {
  WebkitBoxShadow: "0 0 0 1000px white inset",
  WebkitTextFillColor: "#000",
};

const CreateUserPopUp = ({
  isLikeUser,
  setIsLikeUser,
  getUsersData,
  classes,
}: any) => {
  const [modalStyle] = useState(getModalStyle);

  return (
    <Modal open={isLikeUser} onClose={() => setIsLikeUser(false)}>
      <div
        style={{
          position: "absolute",
          width: "680px",
          height: "300px",
          backgroundColor: "white",
          border: "2px solid", // Added "solid" for border style
          boxShadow: "5px 5px 3px gray",
          padding: "20px",
          borderRadius: "10px",
          top: `${50}%`,
          left: `${50}%`,
          transform: `translate(-${50}%, -${50}%)`,
        }}
      >
        <header>
          <h1>Luo uusi käyttäjä</h1>
        </header>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "30ch" },
          }}
          autoComplete="off"
        >
          <TextField
            label="Nimi"
            variant="outlined"
            size="small"
            focused
            required
            name="Nimi"
            autoComplete="new-name"
            type="text"
            margin="dense"
            InputProps={{
              sx: { color: "black" },
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            inputProps={{
              style: inputStyle,
              sx: { color: "black" },
            }}
          />
          <TextField
            label="Sähköposti"
            variant="outlined"
            size="small"
            color="primary"
            focused
            autoComplete="name-email"
            required
            name="Sähköposti"
            type="text"
            margin="dense"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            inputProps={{ style: inputStyle }}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            marginTop: "18px",
            borderRadius: "20px",
            backgroundColor: "#aac929",
            color: "black",
            width: "33.5ch",
            position: "absolute",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bottom: "5%",
          }}
        >
          Luo käyttäjä
        </Button>
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
