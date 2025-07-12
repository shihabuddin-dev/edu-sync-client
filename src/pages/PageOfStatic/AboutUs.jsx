import React from 'react';
import SectionTitle from '../../components/shared/SectionTitle';
import { FaUsers, FaLightbulb, FaChalkboardTeacher, FaLaptopCode, FaRegSmile, FaRocket, FaCalendarAlt, FaStar } from 'react-icons/fa';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import CountUp from 'react-countup';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { MdMenuBook } from 'react-icons/md';

const milestones = [
    { year: '2022', title: 'Edu Sync Founded', desc: 'Our journey began with a vision to connect learners and educators worldwide.', icon: <FaRocket /> },
    { year: '2023', title: 'First 1,000 Users', desc: 'We reached our first major milestone, welcoming 1,000 active users.', icon: <FaUsers /> },
    { year: '2023', title: 'Tutor Collaboration', desc: 'Launched our tutor collaboration tools for seamless study sessions.', icon: <FaChalkboardTeacher /> },
    { year: '2024', title: 'Resource Sharing', desc: 'Introduced resource sharing and study material downloads.', icon: <FaLaptopCode /> },
    { year: '2024', title: 'Global Community', desc: 'Expanded to a global community of students and tutors.', icon: <FaRegSmile /> },
];

const stats = [
    { label: 'Active Users', value: 12000, icon: <FaUsers className="text-primary" /> },
    { label: 'Sessions Hosted', value: 3500, icon: <FaCalendarAlt className="text-primary" /> },
    { label: 'Average Rating', value: 4.8, icon: <FaStar className="text-warning" /> },
];

const testimonials = [
    {
        name: 'Tarek Jamal',
        role: 'Student',
        text: 'Edu Sync made it so easy to find the right tutor and join study sessions. The platform is intuitive and the community is amazing!',
    },
    {
        name: 'Md. Hasan',
        role: 'Tutor',
        text: 'I love how I can share resources and manage my sessions. The dashboard is powerful and the support team is fantastic!',
    },
    {
        name: 'Shihab Uddin',
        role: 'Admin',
        text: 'Managing users and sessions is a breeze. Edu Sync is a game-changer for collaborative learning!',
    },
];

const AboutUs = () => {
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
            {/* Header Section */}
            <div className="bg-base-100 shadow-md pb-2" data-aos="fade-up-right">
                <div className="max-w-4xl mx-auto px-4 py-4 text-center">
                    <SectionTitle title="About Us" icon={<FaUsers />} />
                    <p className="text-base-content/70 max-w-2xl mx-auto leading-relaxed">
                        Edu Sync is a collaborative study platform connecting students, tutors, and administrators. We streamline study session scheduling, resource sharing, and user management to empower modern education for everyone, everywhere.
                    </p>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-2 sm:px-4 py-12">
                {/* Mission Section */}
                <section className="bg-base-100 rounded-md shadow-md border border-base-300 p-4 sm:p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center gap-4 md:gap-6" data-aos="fade-up">
                    <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                        <FaLightbulb className="text-primary text-4xl" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-primary mb-2">Our Mission</h2>
                        <p className="text-base-content/80 text-sm md:text-base">
                            Edu Sync is dedicated to connecting students, tutors, and administrators in a collaborative environment. Our mission is to make learning accessible, engaging, and effective for everyone, everywhere.
                        </p>
                    </div>
                </section>
                {/* Platform Section */}
                <section className="bg-base-100 rounded-md shadow-md border border-base-300 p-4 sm:p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center gap-4 md:gap-6" data-aos="fade-left">
                    <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                        <FaRocket className="text-primary text-4xl" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-primary mb-2">Why Edu Sync?</h2>
                        <ul className="list-disc ml-5 text-base-content/80 text-sm md:text-base space-y-1">
                            <li>Seamless study session scheduling and management</li>
                            <li>Resource sharing and collaborative tools</li>
                            <li>Role-based dashboards for students, tutors, and admins</li>
                            <li>Modern, responsive, and user-friendly design</li>
                            <li>Secure authentication and privacy-first approach</li>
                        </ul>
                    </div>
                </section>
                {/* Stats Section */}
                <section className="bg-base-100 rounded-md shadow-md border border-base-300 p-4 sm:p-6 md:p-8 mb-8" data-aos="zoom-in">
                    <h2 className="text-xl md:text-2xl font-semibold text-base-content mb-6 text-center">Our Impact</h2>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 w-full sm:w-auto">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-primary/10 mb-2 text-2xl sm:text-3xl">
                                    {stat.icon}
                                </div>
                                <span className="text-2xl sm:text-3xl md:text-4xl font-semibold text-primary">
                                    <CountUp end={stat.value} duration={4} decimals={stat.label === 'Average Rating' ? 1 : 0} />
                                    {stat.label === 'Average Rating' && <span className="text-warning text-xl sm:text-2xl">★</span>}
                                </span>
                                <span className="text-base-content/80 text-xs sm:text-sm md:text-base">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </section>
                {/* Timeline Section */}
                <section className="mb-8" data-aos="fade-up">
                    <h2 className="text-xl md:text-2xl font-semibold text-base-content mb-6 text-center">Our Journey</h2>
                    <VerticalTimeline lineColor="#6366F1">
                        {milestones.map((item, idx) => (
                            <VerticalTimelineElement
                                key={idx}
                                className="vertical-timeline-element--work"
                                contentStyle={{ background: 'var(--bg-base-100)', color: 'var(--color-primary)', borderRadius: '0.75rem', boxShadow: 'var(--tw-shadow-md)', border: '1px solid var(--border-base-300)' }}
                                contentArrowStyle={{ borderRight: '7px solid #6366F1' }}
                                date={item.year}
                                iconStyle={{ background: '#6366F1', color: '#fff' }}
                                icon={item.icon}
                            >
                                <h3 className="vertical-timeline-element-title text-lg font-bold mb-1">{item.title}</h3>
                                <p className="vertical-timeline-element-subtitle text-base-content/80 text-sm">{item.desc}</p>
                            </VerticalTimelineElement>
                        ))}
                    </VerticalTimeline>
                </section>
                {/* Team Section */}
                <section className="bg-base-100 rounded-md shadow-md border border-base-300 p-4 sm:p-6 md:p-8 flex flex-col items-center gap-4 md:gap-6" data-aos="fade-up">
                    <div className="flex items-center gap-2 md:gap-4 mb-4">
                        <FaChalkboardTeacher className="text-primary text-3xl" />
                        <FaLaptopCode className="text-primary text-3xl" />
                        <FaRegSmile className="text-success text-3xl" />
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-base-content mb-2">Meet Our Team</h2>
                    <p className="text-base-content/80 text-xs sm:text-sm md:text-base text-center max-w-2xl">
                        Our passionate team of educators, developers, and designers is committed to building a platform that empowers learners and educators alike. We believe in the power of collaboration and technology to transform education for the better.
                    </p>
                </section>

                {/* Info Section */}
                <section className="mt-8 bg-base-100 rounded-md shadow-md border border-base-300 p-4 sm:p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12" data-aos="fade-left">
                    <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                        <MdMenuBook className="text-primary text-4xl" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-primary mb-2">How to Join Sessions</h2>
                        <ul className="list-disc ml-5 text-base-content/80 text-sm md:text-base space-y-1">
                            <li>Browse through available study sessions</li>
                            <li>Check session details, tutor information, and timing</li>
                            <li>Register during the open registration period</li>
                            <li>Join the session at the scheduled time</li>
                            <li>Participate actively and collaborate with other learners</li>
                        </ul>
                    </div>
                </section>
                {/* Testimonials Section */}
                <section className="bg-base-100 rounded-md shadow-md border border-base-300 p-6 md:p-8 mt-8" data-aos="zoom-in-up">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-base-content mb-6 text-center">What Our Users Say</h2>
                    <Slider {...sliderSettings}>
                        {testimonials.map((t, idx) => (
                            <div key={idx} className="flex flex-col justify-center items-center gap-2 sm:gap-3 px-2 sm:px-4">
                                <p className="text-base-content/80 text-center mx-auto max-w-xl italic text-xs sm:text-sm md:text-base">"{t.text}"</p>
                                <div className='mt-2 flex justify-center md:justify-end items-center gap-1 sm:gap-2'><span className="font-semibold text-primary">{t.name}</span>
                                    <span className="text-xs text-base-content/60">{t.role}</span></div>
                            </div>
                        ))}
                    </Slider>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;