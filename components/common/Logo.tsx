import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/#" className="px-4 py-1 shadow-inner">
      <h1 className="sm:text-gradient text-4xl font-bold text-sky-300">
        Dao Tai
      </h1>
    </Link>
  );
};

export default Logo;
