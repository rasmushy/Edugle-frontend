import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import UsersGrid from "../components/UsersGrid";

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.role.toLowerCase() !== "admin") router.replace("/");
  }, [status, session, router]);

  if (status === "loading") {
    return <div>loading...</div>;
  }

  if (session?.user?.role.toLowerCase() !== "admin") {
    return null;
  }

  return (
    <div style={{ position: "relative" }}>
      <UsersGrid />
    </div>
  );
}
