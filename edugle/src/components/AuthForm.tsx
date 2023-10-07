import { useMutation } from "@apollo/client";
import React, { FormEvent, useState } from "react";
import { gql } from "@apollo/client";
import { useRouter } from "next/router";
//import { useNavigate } from "react-router-dom";

export default function AuthForm({ title, apiEndpoint, toggle, setIsAuthenticated }: any) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const navigate = useNavigate();

  const REGISTER_USER = gql(`mutation RegUser($user: RegisterInput!) {
          registerUser(user: $user) {
            user {
            username
            email
            password
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
      },
    },
    onCompleted: ({ registerUser }) => {
      localStorage.setItem("token", registerUser.token);
      localStorage.setItem("username", registerUser.user.username);
      console.log("registerUser", registerUser.token);
    },
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    if (title === "Sign Up") {
      try {
        registerUser();
        console.log("registered Successfully");
        toggle;
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
        //window.location.replace("/chat");
      } catch (error: any) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="flex h-[400px] w-[325px] flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <button
        className="color-white absolute right-2 top-2 text-2xl"
        onClick={toggle}
        aria-label="Close"
      >
        &times;
      </button>
      <div className="flex flex-col items-center justify-center bg-white/10">
        <h1 className="mb-4 text-2xl font-semibold">{title}</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white/15 mb-4 rounded px-8 pb-8 pt-6"
        >
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-white">
              Username
            </label>
            <input
              className="w-full rounded border border-gray-500 px-3 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring"
              type="username"
              name="username"
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-white">
              Email
            </label>
            <input
              className="w-full rounded border border-gray-500 px-3 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring"
              type="email"
              name="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-white">
              Password
            </label>
            <input
              className="w-full rounded border border-gray-500 px-3 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring"
              type="password"
              name="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
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
              {" "}
              {error.message}{" "}
            </div>
          ) : null}

          {data && data.registerUser ? (
            <div className="text-green mb-2 block text-sm font-bold">
              {" "}
              "Succesful"{" "}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
