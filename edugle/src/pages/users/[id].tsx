import { useSession } from "next-auth/react";
import { getServerAuthSession } from "~/server/auth";
import { type GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const User = () => {
  const { data: session } = useSession();

  if (!session) {
    // Handle unauthenticated state, e.g. render a SignIn component
    return <p>Unauthenticated</p>;
  }

  return <p>Welcome {session.user.name}!</p>;
};