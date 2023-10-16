import Link from "next/link";

const NabarBtn = ({ handleAdminPanelPage }: any) => {
  return (
    <Link href="/adminPanel" onClick={() => handleAdminPanelPage()}>
      <p>Admin panel</p>
    </Link>
  );
};

export default NabarBtn;
