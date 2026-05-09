import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/#" className="px-2 py-1">
      <h1 className="font-display text-3xl font-bold text-gradient sm:text-4xl">
        Dao Tai
      </h1>
    </Link>
  );
};

export default Logo;
