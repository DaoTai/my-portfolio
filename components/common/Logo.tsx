import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" scroll className="w-fit flex items-center">
      <Image unoptimized alt="logo" src="/logo.svg" width={80} height={80} />
      <h1 className="text-4xl font-bold text-gradient">Dao Tai</h1>
    </Link>
  );
};

export default Logo;
