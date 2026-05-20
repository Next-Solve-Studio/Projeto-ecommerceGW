"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type ItemType = {
    id: number;
    image: string;
    alt: string;
};

const imgDesktop: ItemType[] = [
    { id: 1, image: "/banner01.png", alt: "Banner01" },
    { id: 2, image: "/banner02.png", alt: "Banner02" },
    { id: 3, image: "/banner03.png", alt: "Banner03" },
];

const imgMobile: ItemType[] = [
    { id: 1, image: "/mobile1.png", alt: "Slide Mobile 1" },
    { id: 2, image: "/mobile2.png", alt: "Slide Mobile 2" },
];

export default function Carousel() {
    return (
        <section className="w-full bg-black overflow-hidden">
            <div className="hidden md:block w-full">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    loop
                    className="group"
                >
                    {imgDesktop.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="relative w-full" style={{ height: "600px" }}>
                                <Image
                                    src={item.image}
                                    alt={item.alt}
                                    fill
                                    priority
                                    quality={100}
                                    className="object-cover transition-transform duration-[8s] group-hover:scale-105"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="block md:hidden w-full">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    loop
                >
                    {imgMobile.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="relative w-full aspect-9/16">
                                <Image
                                    src={item.image}
                                    alt={item.alt}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <style jsx global>{`
                .swiper-pagination {
                    bottom: 16px !important;
                }

                .swiper-pagination-bullet {
                    background: rgba(255, 255, 255, 0.4) !important;
                    opacity: 1;
                    width: 8px;
                    height: 8px;
                    border-radius: 999px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    margin: 0 4px !important;
                }

                .swiper-pagination-bullet-active {
                    background: #FACC15 !important;
                    width: 28px;
                    height: 8px;
                    border-radius: 999px;
                    box-shadow: 0 0 8px rgba(250, 204, 21, 0.7);
                }

                .swiper-button-next,
                .swiper-button-prev {
                    color: #FACC15 !important;
                    transform: scale(0.7);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .group:hover .swiper-button-next,
                .group:hover .swiper-button-prev {
                    opacity: 1;
                }
            `}</style>
        </section>
    );
}