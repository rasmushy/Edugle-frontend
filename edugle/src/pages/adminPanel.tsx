import UsersGrid from "~/components/UsersGrid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user.role !== "Admin") router.replace("/");
  }, [status]);
  return (
    <div style={{ position: "relative" }}>
      <UsersGrid />
    </div>
  );
}
