import UsersGrid from "~/components/UsersGrid";
import withAdmin from "./api/auth/withAdmin";

const adminPanel = () => {
  return (
    <div>
      <UsersGrid />
    </div>
  );
};

export default adminPanel;