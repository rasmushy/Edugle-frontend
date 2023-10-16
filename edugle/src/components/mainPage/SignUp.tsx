import AuthForm from "./AuthForm";
import {type  FormEvent} from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { signIn } from "next-auth/react";

const REGISTER_USER = gql`mutation RegisterUser($user: RegisterInput!) {
  registerUser(user: $user) {
    message
    token
    user {
      email
      id
      username
    }
  }
}`;

export default function SignUp(props: any) {
  const [registerUser, { error, data }] = useMutation(REGISTER_USER, {
    onCompleted: ({ }) => {
      //console.log("registered Successfully");
    },
    onError: (error) => {
      console.log("error", error);
      //console.log('error registerUser=', error.graphQLErrors);
    },
  });

  const handleSignUp = async (
    e: FormEvent<HTMLFormElement>,
    formData: { email: string; username: string; password: string },
  ) => {
    e.preventDefault();

    try {
      await registerUser({
        variables: {
          user: {
            email: formData.email,
            username: formData.username,
            password: formData.password,
          },
        },
      });
      if (props.toggle) props.toggle();
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
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
      successMessage={data?.registerUser && "Registration Successful"}
    />
  );
}
