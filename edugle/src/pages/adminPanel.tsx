import UsersGrid from "~/components/UsersGrid";
import withAdmin from "./api/auth/withAdmin";

const adminPanel = () => {
  return (
    <div className="flex min-h-[90vh] flex-col items-center justify-center bg-gradient-to-b from-[#01497C] to-[#2C7DA0]">
      <UsersGrid />
    </div>
  );
};

export default adminPanel;
