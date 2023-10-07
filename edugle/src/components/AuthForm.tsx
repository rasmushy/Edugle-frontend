import { useMutation } from "@apollo/client";
import React, { FormEvent, useState } from "react";
import { gql } from "@apollo/client";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AccountCircle } from "@mui/icons-material";
import { Button } from "@mui/material";
//import { useNavigate } from "react-router-dom";

export default function AuthForm({
  title,
  apiEndpoint,
  toggle,
  setIsAuthenticated,
}: any) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [checkEmail, setCheckEmail] = useState(true);
  const [checkUserName, setCheckUserName] = useState(true);
  const [checkPassword, setCheckPassword] = useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  // const navigate = useNavigate();

  const REGISTER_USER = gql(`mutation RegUser($user: RegisterInput!) {
          registerUser(user: $user) {
            user {
            username
            email
            password
            description
          }
        }
      }`);

  const LOGIN_USER = gql(`mutation LoginUser($credentials: LoginInput!) {
        loginUser(credentials: $credentials) {
        user {
          username
          email
          password
          id
          description
        }
        token
        message
      }
    }`);

  const [registerUser, { error, data }] = useMutation(REGISTER_USER, {
    variables: {
      user: {
        email: email,
        username: username,
        password: password,
        description: description,
      },
    },
    onCompleted: ({ registerUser }) => {},
  });

  const [loginUser] = useMutation(LOGIN_USER, {
    variables: {
      credentials: {
        email: email,
        password: password,
      },
    },
    onCompleted: ({ loginUser }) => {
      localStorage.setItem("token", loginUser.token);
      console.log("loginUser", loginUser.token);
      setIsAuthenticated(loginUser);
    },
  });

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

    if (title === "Sign Up") {
      try {
        await registerUser();
        console.log("registered Successfully");
        toggle;
        window.location.replace("/");
      } catch (error: any) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const loggedUser = await loginUser();
        console.log("logged in Successfully ", loggedUser);
        toggle;
        window.location.replace("/chat");
      } catch (error: any) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
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
          onSubmit={(e) => validateInput(e)}
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
        <div className="mb-5 h-2">
          {(error || errorMessage) && (
            <div className="mt-2 px-8 text-center">
              {/* Center the error message */}
              <div className="mb-2 block text-sm font-bold text-red-700">
                {error?.message === "Not Authorised!"
                  ? "Username or email is already in use"
                  : error?.message}
              </div>
              {errorMessage && (
                <div className="block text-sm font-bold text-red-700">
                  {errorMessage}
                </div>
              )}
            </div>
          )}

          {data && data.registerUser ? (
            <div className="text-green mb-2 block text-sm font-bold">
              {" "}
              "Successful"{" "}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
