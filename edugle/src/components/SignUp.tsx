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
  const [registerUser, { error, data }] = useRegister("", "", ""); // Initialize with empty strings.

  const handleSignUp = async (e: FormEvent<HTMLFormElement>, formData: { email: string, username: string, password: string }) => {
    e.preventDefault();
    const { email, username, password } = formData;
    const [registerUser, { error, data }] = useRegister(email, username, password); // Update the useRegister call here.

    try {
      await registerUser();
      console.log("registered Successfully=", data);
      if (props.toggle) props.toggle(); // Ensure you call toggle if it's a function.
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <AuthForm
      title="Sign Up"
      onFormSubmit={handleSignUp}
      toggle={props.toggle}
      error={error}
      successMessage={data?.registerUser && "Successful"}
    />
  );
}