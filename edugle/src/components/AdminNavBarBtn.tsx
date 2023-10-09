import Link from "next/link";
import styles from "../styles/styles.module.css";

const NabarBtn = ({ handleAdminPanelPage }: any) => {
  return (
    <Link href="/adminPanel" onClick={() => handleAdminPanelPage()}>
      <p>Admin panel</p>
    </Link>
  );
};

export default NabarBtn;
