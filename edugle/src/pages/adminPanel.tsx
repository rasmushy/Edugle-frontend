import { useSession } from "next-auth/react";
import  Error  from "./_error";
import dynamic from "next/dynamic";

const UsersGrid = dynamic(() => import("~/components/adminPanel/UsersGrid"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function AdminPanel() {
  const { data: session } = useSession();

  if (session?.user.role.toLowerCase() !== "admin") {
   return (<Error statusCode={401} />)
  }
    return (
      <div style={{ position: "relative" }}>
        <UsersGrid />
      </div>
    );
}
