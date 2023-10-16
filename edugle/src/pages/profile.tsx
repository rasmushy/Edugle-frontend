import dynamic from "next/dynamic";


const UserProfile = dynamic(() => import("~/components/profile/UserProfile"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
}); 

export default function Profile() {
      return (
        <div>
          <UserProfile />
        </div>
      );
  }   


