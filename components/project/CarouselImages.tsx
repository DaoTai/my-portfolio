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
import Image from "next/image";

type IProps = {
  previewImages: IProject["previewImages"];
};

const CarouselImages = ({ previewImages }: IProps) => {
  return (
    <Carousel
      className="rounded-xl"
      plugins={[Autoplay({ delay: 9000 })]}
      opts={{ align: "start", loop: true }}
    >
      <CarouselContent>
        {previewImages.map((image, i) => (
          <CarouselItem
            key={i}
            className="relative flex h-full items-center justify-center bg-black/80"
          >
            <Image
              alt="preview"
              src={image}
              width={800}
              height={500}
              className="h-[220px] w-full rounded-xl  object-contain sm:h-[320px] lg:h-[400px]"
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-2 size-8" />
      <CarouselNext className="right-2 size-8" />
    </Carousel>
  );
};

export default CarouselImages;
