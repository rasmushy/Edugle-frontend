import AuthForm from "./AuthForm";

export default function Login(props: any) {
  return (
    <AuthForm
      action="Login"
      title="Login"
      apiEndpoint="/api/login"
      toggle={props.toggle}
    />
  );
}
