"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type ItemType = {
    id: number;
    image: string;
    alt: string;
};

const imgDesktop: ItemType[] = [
    {
        id: 1,
        image: "/bannerSlide-01.png",
        alt: "Ofertas Gamer 1",
    },
    {
        id: 2,
        image: "/bannerSlide-02.png",
        alt: "Ofertas Gamer 2",
    },
];

const imgMobile: ItemType[] = [
    {
        id: 1,
        image: "/mobile1.png",
        alt: "Slide Mobile 1",
    },
    {
        id: 2,
        image: "/mobile2.png",
        alt: "Slide Mobile 2",
    },
];

export default function Carousel() {
    return (
        <section className="w-full pt-30 md:pt-36 bg-black overflow-hidden">
            <div className="hidden md:block w-full">
                <Swiper
                    modules={[Pagination, Autoplay, Navigation]}
                    slidesPerView={1}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    navigation
                    loop
                    className="group"
                >
                    {imgDesktop.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="relative w-full aspect-1920/600">
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
                    pagination={{
                        clickable: true,
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
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
                .swiper-pagination-bullet {
                    background: var(--color-gray) !important;
                    opacity: 0.5;
                    width: 12px;
                    height: 12px;
                    transition: all 0.3s ease;
                }

                .swiper-pagination-bullet-active {
                    background: var(--color-blue) !important;
                    opacity: 1;
                    width: 30px;
                    border-radius: 999px;
                }

                .swiper-button-next,
                .swiper-button-prev {
                    color: var(--color-blue) !important;
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
