import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import Spinner from '../../components/ui/Spinner';
import SectionTitle from '../../components/shared/SectionTitle';
import { FaUsers, FaEnvelopeOpenText, FaQuestionCircle, FaChevronDown, FaExternalLinkAlt, FaDownload } from 'react-icons/fa';
import { useState } from 'react';
import tutorManual from '../../assets/pdf/tutorManual.pdf'

const Tutors = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const axios = useAxios();

    const { data: tutors = [], isLoading, isError, error } = useQuery({
        queryKey: ['tutors'],
        queryFn: async () => {
            const res = await axios.get('/tutors');
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <Spinner />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center text-error py-10">
                Failed to load tutors: {error.message}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
            <title>Tutors | Edu Sync</title>
            {/* Header Section */}
            <div className="bg-base-100 shadow-md pb-2" data-aos="fade-up-right">
                <div className="max-w-4xl mx-auto px-4 py-4 text-center">
                    <SectionTitle title="Our Tutors" icon={<FaUsers />} />
                    <p className="text-base-content/70 max-w-2xl mx-auto leading-relaxed">
                        Meet our dedicated team of tutors who are passionate about helping students succeed. Each tutor brings unique expertise and a commitment to collaborative learning.
                    </p>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-2 sm:px-4 py-12">
                {/* Tutors List Section */}
                <section className="bg-base-100 rounded-md shadow-md border border-base-300 p-4 sm:p-6 md:p-8 mb-8" data-aos="fade-up">
                    {tutors.length === 0 ? (
                        <div className="text-center text-base-content/60">No tutors found.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {tutors.map((tutor, idx) => (
                                <div
                                    key={tutor._id || idx}
                                    className="group bg-base-100 rounded-md shadow-md hover:shadow-xl border border-base-300 p-5 flex flex-col items-center transition duration-300"
                                >
                                    <div className="relative">
                                        <img
                                            src={tutor.photoURL || '/default-avatar.png'}
                                            alt={tutor.name || 'Tutor'}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow-md"
                                            onError={(e) => {
                                                e.target.src = '/default-avatar.png';
                                            }}
                                        />
                                        <span className="absolute -bottom-2 right-0 bg-gradient-to-r from-primary to-primary/60 text-primary-content text-xs font-medium px-2 py-0.5 rounded shadow-md">
                                            Tutor
                                        </span>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <h3 className="text-lg font-semibold text-base-content group-hover:text-primary transition">
                                            {tutor.name || 'Unknown Tutor'}
                                        </h3>
                                        {tutor.created_at && (
                                            <p className="text-sm text-base-content/60 mt-1">
                                                Joined {new Date(tutor.created_at).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                            </p>
                                        )}
                                        {tutor.bio && (
                                            <p className="mt-2 text-sm text-base-content/70 line-clamp-3">
                                                {tutor.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                    )}
                </section>
            </div>
            {/* Tutor Help & Resources Section */}
            <div className="max-w-4xl mx-auto px-2 sm:px-4 pb-16 flex flex-col gap-10">
                {/* Help Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-6 flex flex-col items-center gap-3" data-aos="fade-right">
                        <FaUsers className="text-primary text-3xl mb-1" />
                        <h3 className="font-semibold text-base-content">Become a Tutor</h3>
                        <a href="/signUp" className="text-primary hover:underline text-sm">Apply Now</a>
                    </div>
                    <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-6 flex flex-col items-center gap-3" data-aos="fade-left">
                        <FaEnvelopeOpenText className="text-primary text-3xl mb-1" />
                        <h3 className="font-semibold text-base-content">Tutor Support</h3>
                        <a href="mailto:tutorsupport@edusync.com" className="text-primary hover:underline text-sm">tutorsupport@edusync.com</a>
                    </div>
                </div>
                {/* FAQ Accordion for Tutors */}
                <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-6" data-aos="fade-up">
                    <div className="flex items-center gap-2 mb-4">
                        <FaQuestionCircle className="text-primary text-xl" />
                        <h2 className="text-lg sm:text-xl font-semibold text-base-content">Tutor FAQs</h2>
                    </div>
                    <div className="divide-y divide-base-300">
                        {[{
                            question: "How do I become a tutor?",
                            answer: "Sign up and select 'Tutor' as your role. Complete your profile and submit your credentials for admin approval."
                        }, {
                            question: "How do I manage my study sessions?",
                            answer: "Go to your dashboard, where you can create, edit, and manage your study sessions."
                        }, {
                            question: "How do I communicate with students?",
                            answer: "You can message students directly from your dashboard or via the session details page."
                        }, {
                            question: "Where can I find teaching resources?",
                            answer: "Check the Resources section below for guides and best practices."
                        }].map((faq, idx) => (
                            <div key={idx}>
                                <button
                                    className="w-full flex justify-between items-center py-3 text-left text-base-content/90 font-medium focus:outline-none"
                                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                    aria-expanded={openIndex === idx}
                                >
                                    <span>{faq.question}</span>
                                    <FaChevronDown className={`transition-transform duration-200 ${openIndex === idx ? 'rotate-180 text-primary' : ''}`} />
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-40 py-2' : 'max-h-0 py-0'}`}>
                                    <p className="text-base-content/70 text-sm">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Quick Links for Tutors */}
                <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-6 flex flex-col gap-3" data-aos="zoom-in">
                    <h2 className="text-lg sm:text-xl font-semibold text-base-content mb-2 flex items-center gap-2">
                        <FaExternalLinkAlt className="text-primary" /> Tutor Quick Links
                    </h2>
                    <a href={tutorManual} className="text-primary hover:underline flex items-center gap-2 text-sm" download>
                        Tutor Manual (PDF) <FaDownload className="text-xs" />
                    </a>
                    <Link to="/about-us" className="text-primary hover:underline flex items-center gap-2 text-sm">
                        About Us <FaExternalLinkAlt className="text-xs" />
                    </Link>
                    <Link to="/support" className="text-primary hover:underline flex items-center gap-2 text-sm">
                        Support <FaExternalLinkAlt className="text-xs" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Tutors;