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

  if (session?.user.role === "Admin") {
    return (
      <div className="flex min-h-[90vh] flex-col items-center justify-center bg-gradient-to-b from-[#01497C] to-[#2C7DA0]">
        <UsersGrid />
      </div>
    );
  }
}
