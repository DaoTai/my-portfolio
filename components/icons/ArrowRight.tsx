import Image from "next/image";
import React from "react";

const ArrowRight = () => {
  return (
    <Image
      width={24}
      height={24}
      src="/icons/arrow-right-short.svg"
      alt="Arrow Right"
      className="size-8"
    />
  );
};

export default ArrowRight;
