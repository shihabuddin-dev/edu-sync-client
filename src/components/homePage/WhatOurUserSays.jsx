import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { MdFormatQuote, MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

const reviews = [
    {
        name: "James Miller",
        location: "London, United Kingdom",
        img: "https://randomuser.me/api/portraits/men/1.jpg",
        text: "EduSync's live sessions helped me connect with top tutors and improve my grades. Highly recommended!",
    },
    {
        name: "Liam Johnson",
        location: "Toronto, Canada",
        img: "https://randomuser.me/api/portraits/men/2.jpg",
        text: "The platform is easy to use and the resources are always up to date. I love the flexibility!",
    },
    {
        name: "Noah Smith",
        location: "Sydney, Australia",
        img: "https://randomuser.me/api/portraits/men/3.jpg",
        text: "I found great study partners through EduSync. The group discussions are very helpful!",
    },
    {
        name: "Benjamin Lee",
        location: "New York, USA",
        img: "https://randomuser.me/api/portraits/men/4.jpg",
        text: "The reminders and booking process keep me organized. EduSync is a must for students!",
    },
    {
        name: "William Brown",
        location: "Berlin, Germany",
        img: "https://randomuser.me/api/portraits/men/5.jpg",
        text: "I appreciate the quick responses from the support team. EduSync really cares about its users.",
    },
    {
        name: "Lucas Garcia",
        location: "Madrid, Spain",
        img: "https://randomuser.me/api/portraits/men/6.jpg",
        text: "The mobile experience is fantastic. I can join sessions from anywhere, anytime!",
    },
    {
        name: "Mason Wilson",
        location: "Cape Town, South Africa",
        img: "https://randomuser.me/api/portraits/men/7.jpg",
        text: "EduSync’s quizzes and practice tests are a great way to prepare for exams.",
    },
    {
        name: "Ethan Kim",
        location: "Seoul, South Korea",
        img: "https://randomuser.me/api/portraits/men/8.jpg",
        text: "I love the community feel. Everyone is supportive and eager to help each other learn.",
    },
    {
        name: "Alexander Rossi",
        location: "Rome, Italy",
        img: "https://randomuser.me/api/portraits/men/9.jpg",
        text: "The session recordings are a lifesaver when I need to review. EduSync is perfect for busy students!",
    },
    {
        name: "Henry Dubois",
        location: "Paris, France",
        img: "https://randomuser.me/api/portraits/men/10.jpg",
        text: "EduSync’s resources cover a wide range of topics. I always find what I need.",
    },
    {
        name: "Jack Evans",
        location: "Auckland, New Zealand",
        img: "https://randomuser.me/api/portraits/men/11.jpg",
        text: "The tutors are knowledgeable and the sessions are always interactive!",
    },
    {
        name: "Samuel Clark",
        location: "Chicago, USA",
        img: "https://randomuser.me/api/portraits/men/12.jpg",
        text: "I can track my progress and set learning goals easily. EduSync keeps me motivated.",
    },
    {
        name: "David Andersson",
        location: "Stockholm, Sweden",
        img: "https://randomuser.me/api/portraits/men/13.jpg",
        text: "The platform is reliable and the support team is always ready to help. Great experience!",
    },
];

const WhatOurUserSays = () => {
    return (
        <section data-aos="zoom-out-right">
            <h2 className='mb-2 md:mb-4 text-center text-2xl md:text-3xl font-bold'>What Our Users Say</h2>
            <p className="text-center text-base-content/80 mb-8 md:mb-10 text-base md:text-lg max-w-2xl mx-auto">Real feedback from learners around the world who have experienced EduSync.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Left: Title, Subtitle, Arrows */}
                <div className="flex flex-col items-start md:items-center">
                    <h3 className="text-2xl md:text-3xl font-semibold mb-2">
                        From our <span className="text-primary">Session</span>
                    </h3>
                    <p className="mb-8 max-w-2xs">
                        See what our users are saying about their EduSync experience.
                    </p>
                    <div className="flex gap-3">
                        <button className="swiper-button-prev-custom w-8 md:w-10 h-8 md:h-10 flex items-center justify-center rounded-full pl-2 border border-primary hover:bg-secondary/10 transition">
                            <MdArrowBackIos size={20} />
                        </button>
                        <button className="swiper-button-next-custom w-8 md:w-10 h-8 md:h-10 flex items-center justify-center rounded-full border border-primary hover:bg-secondary/10 transition">
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
                                    <p className="md:text-xl font-medium mb-6 leading-snug">
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