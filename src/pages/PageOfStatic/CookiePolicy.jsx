import React from 'react';
import { FaCookieBite, FaInfoCircle, FaLock, FaRegClock, FaUserSecret, FaArrowRight } from 'react-icons/fa';
import SectionTitle from '../../components/shared/SectionTitle';
import Button from '../../components/ui/Button';
import { Link } from 'react-router';

const CookiePolicy = () => {
    const currentYear = new Date().getFullYear();

    const steps = [
        {
            icon: <FaInfoCircle className="text-primary w-6 h-6" />,
            title: 'What Are Cookies?',
            desc: 'Cookies are small text files stored on your device to help websites remember information about your visit, preferences, and activity.'
        },
        {
            icon: <FaCookieBite className="text-secondary w-6 h-6" />,
            title: 'How We Use Cookies',
            desc: 'Edu Sync uses cookies to personalize your experience, analyze site usage, and enhance security. We do not use cookies to collect sensitive personal information.'
        },
        {
            icon: <FaLock className="text-success w-6 h-6" />,
            title: 'Cookie Security',
            desc: 'All cookies used by Edu Sync are encrypted and protected. We never share your cookie data with third parties for marketing.'
        },
        {
            icon: <FaRegClock className="text-warning w-6 h-6" />,
            title: 'Cookie Duration',
            desc: 'Some cookies are session-based and expire when you close your browser, while others remain for a set period to remember your preferences.'
        },
        {
            icon: <FaUserSecret className="text-error w-6 h-6" />,
            title: 'Your Choices',
            desc: 'You can manage or disable cookies in your browser settings. However, disabling cookies may affect your experience on Edu Sync.'
        },
    ];

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header */}
            <div className="bg-base-100 shadow-md" data-aos="fade-down-left">
                <div className="max-w-3xl mx-auto px-4 py-6 text-center relative z-10">
                    <SectionTitle title="Cookie Policy" icon={<FaCookieBite />} />
                    <p className="text-base-content/70 max-w-xl mx-auto leading-relaxed">
                        This Cookie Policy explains how Edu Sync uses cookies and similar technologies to recognize you. It explains what these technologies are and why we use them.
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-base-content/60">
                        <FaCookieBite className="text-primary" />
                        <span>Last updated: {currentYear}</span>
                    </div>
                </div>
            </div>

            {/* Timeline/Stepper */}
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="relative border-l-4 border-primary/20 ml-4">
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className="mb-12 pl-8 relative group transition-transform transform duration-400 ease-in-out hover:scale-[1.025] hover:shadow-md z-10"
                        >
                            <div className="absolute -left-7 top-0 bg-base-100 border-2 border-primary w-12 h-12 rounded-full flex items-center justify-center shadow-md group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-base-content mb-2 mt-1 group-hover:text-primary transition-colors duration-400">
                                {step.title}
                            </h3>
                            <p className="text-base-content/80 text-sm leading-relaxed">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className="max-w-3xl mx-auto px-4 pb-12" data-aos="zoom-in-up">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-md shadow-md p-6 md:p-8 border border-base-300 text-center">
                    <h2 className="text-2xl font-semibold text-base-content mb-4">
                        Have Questions About Cookies?
                    </h2>
                    <p className="text-base-content/80 mb-6 max-w-xl mx-auto">
                        If you have any questions about our Cookie Policy or how we use cookies, please contact us.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant='primary'>
                            <a href="mailto:privacy@edusync.com" className="inline-flex items-center gap-2">
                                <FaCookieBite />
                                Email Us
                            </a>
                        </Button>
                        <Button variant='secondary'>
                            <Link to='/contact-us' className="inline-flex items-center gap-2">
                                <FaArrowRight />
                                Contact Us
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;