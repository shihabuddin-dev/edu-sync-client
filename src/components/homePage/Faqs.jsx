import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaUserGraduate, FaChalkboardTeacher, FaBookOpen, FaChartLine } from 'react-icons/fa';
import faqsImg from '../../assets/faqs.svg';
import SectionTitle from '../shared/SectionTitle';

const faqData = [
    {
        question: "What is EduSync?",
        answer: "EduSync is a collaborative learning platform that connects students and tutors for live study sessions, resource sharing, and progress tracking."
    },
    {
        question: "How do I join a study session?",
        answer: "Simply sign up, browse available sessions, and click 'Join' or 'Book' to participate in a session that matches your interests."
    },
    {
        question: "Is EduSync free to use?",
        answer: "EduSync offers both free and premium sessions. You can access many resources and join free sessions at no cost."
    },
    {
        question: "How can I become a tutor?",
        answer: "Complete your profile and apply as a tutor. Our team will review your application and notify you upon approval."
    },
    {
        question: "Can I track my learning progress?",
        answer: "Yes! EduSync provides dashboards and analytics to help you monitor your learning journey and achievements."
    }
];

const faqIcons = [
    FaQuestionCircle,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaBookOpen,
    FaChartLine
];

const Faqs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = idx => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <div className="relative rounded-md py-16 px-4 bg-base-200/40" data-aos="fade-down"
     data-aos-easing="linear"
     data-aos-duration="1000">
            <h2 className='mb-2 md:mb-4 text-center text-2xl md:text-3xl font-bold'>Frequently Asked Questions</h2>
            <p className="text-center text-base-content/80 mb-8 md:mb-10 text-base md:text-lg max-w-2xl mx-auto">Find answers to common questions about EduSync, our features, and how to get the most out of your learning experience.</p>
            <div className="max-w-4xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8 md:gap-10 w-full">
                {/* FAQ List */}
                <div className="flex-1 w-full max-w-full md:max-w-none">
                    <div className="space-y-4 w-full">
                        {faqData.map((faq, idx) => {
                            const Icon = faqIcons[idx % faqIcons.length];
                            return (
                                <div
                                    key={idx}
                                    className={`bg-base-100 rounded-md shadow-md border border-base-300 transition-all duration-300 hover:shadow-primary/30 group relative overflow-hidden w-full`}
                                >
                                    <div className="flex items-center gap-2 px-4 md:px-6 pt-4">
                                        <Icon className="text-primary text-xl md:text-2xl" />
                                        <button
                                            className="flex-1 flex items-center justify-between text-left font-semibold text-base-content/90 focus:outline-none py-2"
                                            onClick={() => toggleFaq(idx)}
                                            aria-expanded={openIndex === idx}
                                        >
                                            <span className="text-base md:text-lg font-semibold">{faq.question}</span>
                                            {openIndex === idx
                                                ? <FaChevronUp className="text-primary ml-2" />
                                                : <FaChevronDown className="text-base-content/60 ml-2" />}
                                        </button>
                                    </div>
                                    <div
                                        className={`px-4 md:px-6 pb-3 text-base-content/80 text-sm transition-all duration-400 ease-in-out ${
                                            openIndex === idx ? 'max-h-40 opacity-100 py-2' : 'max-h-0 opacity-0 overflow-hidden'
                                        }`}
                                    >
                                        {faq.answer}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* Decorative Image */}
                <div className="flex-1 flex justify-center items-center w-full md:w-auto mb-8 md:mb-0">
                    <img
                        src={faqsImg}
                        alt="Frequently Asked Questions"
                        className="w-48 sm:w-60 md:w-80 lg:w-96 h-auto object-contain drop-shadow-lg"
                        loading="lazy"
                    />
                </div>
            </div>
        </div>
    );
};

export default Faqs;