import React, { type FormEvent, useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AccountCircle } from "@mui/icons-material";

export default function AuthForm({
  title,
  onFormSubmit,
  toggle,
  error,
  successMessage,
}: {
  title: string;
  onFormSubmit: (
    e: FormEvent<HTMLFormElement>,
    data: {
      username: string;
      email: string;
      password: string;
      description?: string;
    },
  ) => void;
  toggle: () => void;
  error: any;
  successMessage: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [checkEmail, setCheckEmail] = useState(true);
  const [checkUserName, setCheckUserName] = useState(true);
  const [checkPassword, setCheckPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [, setErrorMessage] = useState<string>("");

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
    });
    setIsLoading(false);
  }

  return (
    <div className="flex max-h-[100vh] min-w-[40vh] flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#2C7DA0] to-[#15162c] drop-shadow-2xl ">
      <button
        className="color-white absolute right-2 top-2 text-4xl"
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
              sx={{ width: "100%", backgroundColor: "white" }}
              id="Email"
              autoComplete="email"
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
              sx={{ width: "100%", backgroundColor: "white" }}
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
          <div className="flex justify-center">
            <button
              type="submit"
              className="focus:shadow-outline rounded bg-[#2C7DA0] px-10 py-2 font-bold text-white hover:bg-[#01497C] focus:outline-none"
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
