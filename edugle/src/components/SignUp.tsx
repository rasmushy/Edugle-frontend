import AuthForm from "./AuthForm";
import { FormEvent } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

const REGISTER_USER = gql(`mutation RegUser($user: RegisterInput!) {
          registerUser(user: $user) {
            user {
            username
            email
            password
          }
        }
      }`);

export function useRegister(email: string, username: string, password: string) {
  return useMutation(REGISTER_USER, {
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
}

export default function SignUp(props: any) {
  console.log("props SignUp=", props);
  const [registerUser, { error, data }] = useRegister(props.email, props.username, props.password);

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      try {
        registerUser();
        console.log("registered Successfully");
        props.toggle;
      } catch (error: any) {
        console.error(error);
      }   };

  return (
    <AuthForm
      title="Sign Up"
      onFormSubmit={handleSignUp}
      toggle={props.toggle}
      error={error}
      email={props.email}
      password={props.password}
      username={props.username}
      successMessage={data?.registerUser && "Successful"}
    />
  );
}
