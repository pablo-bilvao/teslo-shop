"use client";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import { ProductImage as Image } from "@/components";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import "./slideshow.css";

interface Props {
  images: string[];
  title: string;
  className?: string;
}

export const ProductMobileSlideshow = ({ images, title, className }: Props) => {
  return (
    <div className={className}>
      <Swiper
        style={{
          width: "100vw",
          height: "500px",
        }}
        pagination
        navigation={true}
        autoplay={{ delay: 2500 }}
        modules={[FreeMode, Autoplay, Pagination]}
        className="mySwiper2"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={image}
              alt={title}
              width={600}
              height={500}
              className="object-fill"
            />
          </SwiperSlide>
        ))}

        {images.length === 0 && (
          <SwiperSlide>
            <Image
              alt={title}
              width={300}
              height={300}
              className="rounded-lg object-fill"
            />
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};
