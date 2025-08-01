"use client";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";
import { TriangleRightIcon } from "@radix-ui/react-icons";

type IProps = {
  uri: IProject["uri"];
  previewImages: IProject["previewImages"];
};

const CarouselImages = ({ uri, previewImages }: IProps) => {
  return (
    <Carousel
      className="rounded-lg "
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {previewImages.map((image, i) => (
          <CarouselItem className="relative bg-black/90" key={i}>
            {uri && (
              <Link
                href={uri}
                title={uri}
                target="_blank"
                className="absolute left-1/2 top-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-full  bg-gradient  shadow-2xl "
              >
                <TriangleRightIcon className="size-12 text-white" />
                <span className="absolute inset-0  h-full w-full animate-ping rounded-full bg-gradient opacity-75"></span>
              </Link>
            )}

            <Image
              unoptimized
              alt="preview"
              src={image}
              width={200}
              height={200}
              className="h-full w-full rounded-lg  object-contain object-top md:h-[600px]"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 size-10" />
      <CarouselNext className="right-2 size-10" />
    </Carousel>
  );
};

export default CarouselImages;
