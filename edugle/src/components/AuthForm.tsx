import React, { FormEvent, useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AccountCircle } from "@mui/icons-material";
import { Box, Button } from "@mui/material";

export default function AuthForm({
  title,
  onFormSubmit,
  toggle,
  error,
  successMessage,
}: {
  title: string;
  onFormSubmit: (e: FormEvent<HTMLFormElement>, data: {username: string, email: string, password: string, description?: string}) => void;
  toggle: () => void;
  error: any;
  successMessage: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [checkEmail, setCheckEmail] = useState(true);
  const [checkUserName, setCheckUserName] = useState(true);
  const [checkPassword, setCheckPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

const handleClickShowPassword = () => setShowPassword((show) => !show);

  const validateInput = (e: FormEvent<HTMLFormElement>) => {
    if (title === "Sign Up") {
      const re = /\S+@\S+\.\S+/;
      const valid = re.test(email);

      const newCheckEmail =
        email.includes("@") && valid && !email.includes(" ");
      setCheckEmail(newCheckEmail);

      const newCheckUserName = username !== "";
      setCheckUserName(newCheckUserName);

      const newCheckPassword =
        password !== "" && password.length >= 2 && !password.includes(" ");
      setCheckPassword(newCheckPassword);

      if (newCheckUserName && newCheckEmail && newCheckPassword) {
        e.preventDefault();
        handleSubmit(e);
      } else {
        setErrorMessage(
          "Email or Password is incorrect! Password must be at least 10 characters long and not contain spaces.",
        );
        e.preventDefault();
      }
    } else {
      handleSubmit(e);
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    await onFormSubmit(e, {
      username,
      email,
      password,
      description,
    });
    setIsLoading(false);
  }

  return (
    <div className="flex h-[800px] w-[400px] flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <button
        className="color-white absolute right-2 top-2 text-2xl"
        onClick={toggle}
        aria-label="Close"
      >
        &times;
      </button>
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-semibold">{title}</h1>
        <form
          onSubmit={validateInput}
          className="bg-white/15 mb-4 rounded px-8 pb-8 pt-6"
        >
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-white">
              Username
            </label>
            <TextField
              error={!checkUserName}
              autoComplete="username"
              variant="outlined"
              focused
              required
              placeholder="Username"
              sx={{ width: "100%", backgroundColor: "white", borderRadius: 2 }}
              type="text"
              margin="dense"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              InputProps={{
                sx: { color: "black" },
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-white">
              Email
            </label>
            <TextField
              error={!checkEmail}
              required
              sx={{ width: "100%", backgroundColor: "white", borderRadius: 2 }}
              id="Email"
              placeholder="Email"
              label="Required"
              variant="filled"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-white">
              Password
            </label>
            <TextField
              error={!checkPassword}
              required
              sx={{ width: "100%", backgroundColor: "white", borderRadius: 2 }}
              id="PassWord"
              label="Required"
              variant="filled"
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={handleClickShowPassword}
                    sx={{
                      cursor: "pointer",
                      position: "absolute",
                      right: 20,
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </InputAdornment>
                ),
              }}
            />
          </div>
          {title === "Sign Up" && ( // Conditional rendering for description field
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-white">
                Description
              </label>
              <TextField
                id="outlined-multiline-static"
                sx={{ width: "100%", backgroundColor: "white" }}
                multiline
                autoComplete="off"
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about yourself"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : title}
            </button>
          </div>
        </form>
        <div className="mb-2 h-5">
        {error ? (
          <div className="mb-2 block text-sm font-bold text-red-700">
            {error.message}
          </div>
        ) : null}
        {successMessage ? (
          <div className="text-green mb-2 block text-sm font-bold">
            {successMessage}
          </div>
        ) : null}
      </div>
    </div>
    </div>
  );
}
