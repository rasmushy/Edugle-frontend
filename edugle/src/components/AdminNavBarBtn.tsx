import withAdmin from "../../src/pages/api/auth/withAdmin";
import Link from "next/link";

const NabarBtn = () => {
  return (
    <Link href="/adminPanel">
      <button className="bg-[#FFFFFF rounded p-2 text-[#012A4A]">
        Admin Panel
      </button>
    </Link>
  );
};

export default NabarBtn;
