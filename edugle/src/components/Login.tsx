import React from "react";
import AuthForm from "./AuthForm";

export default function Login(props: any) {
  console.log(props, " login props");

  return <AuthForm title="Login" toggle={props.toggle} />;
}
