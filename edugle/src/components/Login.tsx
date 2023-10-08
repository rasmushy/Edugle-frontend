import AuthForm from "./AuthForm";
import { FormEvent } from "react";
import { signIn } from "next-auth/react";

export default function Login(props: any) {
  const handleLogin = async (
    e: FormEvent<HTMLFormElement>,
    formData: { email: string; password: string },
  ) => {
    e.preventDefault();

    console.log(formData, "formData");

    const result = await signIn("credentials", {
      // Pass in the credentials
      email: formData.email,
      password: formData.password,
    });

    console.log(result, "result");
    // Check the result of signIn. If it's null, there was an error.
    if (result?.ok === false) {
      console.error("Login failed");
      // You can set some state here to show an error message to the user.
      //props.setError(result.error);
      if (props.toggle) props.toggle();
    } else {
      console.log("Logged in Successfully");
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
