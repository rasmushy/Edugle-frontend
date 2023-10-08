import React from "react";
import AuthForm from "./AuthForm";

export default function SignUp(props: any) {
  console.log(props, " signup props");
  return <AuthForm title="Sign Up" toggle={props.toggle} />;
}
