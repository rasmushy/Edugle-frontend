import AuthForm from "./AuthForm";
import { FormEvent } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

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

export function useLogin(email: string, password: string) {
  return useMutation(LOGIN_USER, {
    variables: {
      credentials: {
        email: email,
        password: password,
      },
    },
    onCompleted: ({ loginUser }) => {
      localStorage.setItem("token", loginUser.token);
      console.log("loginUser", loginUser.token);
    },
  });
}

export default function Login(props: any) {

  console.log("props Login=", props);
  const [loginUser, { error, data }] = useLogin(props.email, props.password);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      try {
        const loggedUser = await loginUser();
        console.log("logged in Successfully ", loggedUser);
        props.toggle;
      } catch (error: any) {
        console.error(error);
      } 
  };

  return (
    <AuthForm
      title="Login"
      onFormSubmit={handleLogin}
      toggle={props.toggle}
      email={props.email}
      password={props.password}
      username={props.username}
      error={error}
      successMessage={data?.loginUser && "Logged in Successfully"}
    />
  );
}