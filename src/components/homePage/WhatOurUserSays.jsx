import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { MdFormatQuote, MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import SectionTitle from "../shared/SectionTitle";

const reviews = [
    {
        name: "Sadia Rahman",
        location: "Dhaka, Bangladesh",
        img: "https://i.pravatar.cc/100?img=11",
        text: "EduSync has made it so easy to connect with top tutors and join interactive study sessions. The service is fast and always reliable.",
    },
    {
        name: "Arif Chowdhury",
        location: "Chittagong, Bangladesh",
        img: "https://i.pravatar.cc/100?img=12",
        text: "I love the variety of courses EduSync offers. It’s my go-to for quick, effective learning!",
    },
    {
        name: "Maya Sultana",
        location: "Sylhet, Bangladesh",
        img: "https://i.pravatar.cc/100?img=13",
        text: "Every session is well-organized and the platform is easy to use. EduSync never disappoints!",
    },
    {
        name: "Tanvir Hasan",
        location: "Rajshahi, Bangladesh",
        img: "https://i.pravatar.cc/100?img=14",
        text: "Great support and a user-friendly interface. EduSync makes learning a breeze.",
    },
    {
        name: "Nusrat Jahan",
        location: "Khulna, Bangladesh",
        img: "https://i.pravatar.cc/100?img=15",
        text: "The best online learning experience I’ve had. Highly recommended!",
    },
];

const WhatOurUserSays = () => {
    return (
        <section>
            <div className='mb-10 md:mb-12'><SectionTitle title='Session Reviews' />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Left: Title, Subtitle, Arrows */}
                <div className="flex flex-col items-start md:items-center">
                    <h3 className="text-2xl md:text-3xl font-semibold mb-2">
                        From our{" "}
                        <span className="text-primary">Session</span>
                    </h3>
                    <p className="mb-8 max-w-2xs">
                        See what our users are saying about their EduSync experience.
                    </p>
                    <div className="flex gap-3">
                        <button className="swiper-button-prev-custom w-10 h-10 flex items-center justify-center rounded-full pl-2 border border-primary hover:bg-secondary/10 transition">
                            <MdArrowBackIos size={20} />
                        </button>
                        <button className="swiper-button-next-custom w-10 h-10 flex items-center justify-center rounded-full border border-primary hover:bg-secondary/10 transition">
                            <MdArrowForwardIos size={20} />
                        </button>
                    </div>
                </div>
                {/* Right: Swiper Review */}
                <div>
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        navigation={{
                            prevEl: ".swiper-button-prev-custom",
                            nextEl: ".swiper-button-next-custom",
                        }}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{ delay: 3500, disableOnInteraction: false }}
                        speed={700}
                        className="w-full"
                    >
                        {reviews.map((review, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="bg-base-100/90 p-0 md:p-4 flex flex-col items-start">
                                    <span className="text-3xl text-primary mb-4">
                                        <MdFormatQuote />
                                    </span>
                                    <p className="text-xl font-medium mb-6 leading-snug">
                                        {review.text}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <img
                                            src={review.img}
                                            alt={review.name}
                                            className="w-10 h-10 rounded-full border border-primary"
                                        />
                                        <div>
                                            <p className="font-semibold text-primary leading-tight">
                                                {review.name}
                                            </p>
                                            <p className="text-xs leading-tight">
                                                {review.location}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default WhatOurUserSays;