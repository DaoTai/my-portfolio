import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/#" className="rounded-full px-4  py-1 shadow-inner">
      <h1 className="text-gradient text-4xl font-bold">Dao Tai</h1>
    </Link>
  );
};

export default Logo;
