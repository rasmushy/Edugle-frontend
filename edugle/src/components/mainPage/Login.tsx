import AuthForm from "./AuthForm";
import type { FormEvent } from "react";
import { signIn } from "next-auth/react";

export default function Login(props: any) {
  const handleLogin = async (
    e: FormEvent<HTMLFormElement>,
    formData: { email: string; password: string },
  ) => {
    e.preventDefault();

    //console.log(formData, "formData");

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });


    if (result?.ok === false) {
      //console.error("Login failed");

      //props.setError(result.error);
      if (props.toggle) props.toggle();
    } else {
      //console.log("Logged in Successfully");
      //props.setSuccessMessage("Logged in Successfully");
      if (props.toggle) props.toggle();
    }
  };

  return (
    <AuthForm
      title="Login"
      onFormSubmit={handleLogin}
      toggle={props.toggle}
      error={props.error}
      successMessage={props.successMessage}
    />
  );
}
