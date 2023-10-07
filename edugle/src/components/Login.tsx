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
  const [loginUser, { error, data }] = useLogin("", ""); // initialize with empty strings

  const handleLogin = async (e: FormEvent<HTMLFormElement>, formData: {email: string, password: string}) => {
    e.preventDefault();
    const { email, password } = formData;
    const [loginUser, { error, data }] = useLogin(email, password); // update the useLogin call here

    try {
      await loginUser();
      console.log("logged in Successfully ", data);
      if (props.toggle) props.toggle(); 
    } catch (error: any) {
      console.error(error);
    } 
  };

  return (
    <AuthForm
      title="Login"
      onFormSubmit={handleLogin}
      toggle={props.toggle}
      error={error}
      successMessage="Logged in successfully"
    />
  );
}