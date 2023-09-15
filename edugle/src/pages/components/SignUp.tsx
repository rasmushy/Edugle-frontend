import AuthForm from "./AuthForm";

export default function SignUp(props: any) {
  return (
    <AuthForm
      action="Sign Up"
      title="Sign Up"
      apiEndpoint="/api/signup"
      toggle={props.toggle}
    />
  );
}
