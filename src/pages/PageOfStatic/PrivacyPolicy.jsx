import React from 'react';
import {
    FaShieldAlt,
    FaUserSecret,
    FaDatabase,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaCookieBite,
    FaHandshake,
    FaExclamationTriangle,
    FaCheckCircle,
    FaArrowRight,
    FaGraduationCap,
    FaEnvelope
} from 'react-icons/fa';
import Button from '../../components/ui/Button';
import { Link } from 'react-router';
import SectionTitle from '../../components/shared/SectionTitle';

const PrivacyPolicy = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 ">
            {/* Header Section */}
            <div className="bg-base-100 shadow-md" data-aos="fade-up-right">
                <div className="max-w-4xl mx-auto px-4 py-4 text-center">
                    <SectionTitle title="Privacy Policy" icon={<FaShieldAlt />} />
                    <p className="text-base-content/70 max-w-2xl mx-auto leading-relaxed">
                        At Edu Sync, we are committed to protecting your privacy and ensuring the security of your personal information.
                        This policy outlines how we collect, use, and safeguard your data.
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-base-content/60">
                        <FaGraduationCap className="text-primary" />
                        <span>Last updated: {currentYear}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="space-y-10">

                    {/* Information We Collect */}
                    <section className="bg-base-100 rounded-md shadow-md p-6 md:p-8 border border-base-300" data-aos="fade-up">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                                <FaDatabase className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-base-content">
                                Information We Collect
                            </h2>
                        </div>
                        <div className="space-y-4 text-base-content/80">
                            <div className="flex items-start gap-3">
                                <FaCheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-base-content mb-2">Personal Information</h3>
                                    <p className="text-sm leading-relaxed">
                                        We collect information you provide directly to us, such as your name, email address,
                                        profile picture, and role (student, tutor, or administrator) when you create an account.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FaCheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-base-content mb-2">Usage Information</h3>
                                    <p className="text-sm leading-relaxed">
                                        We automatically collect information about how you use our platform, including study sessions
                                        you attend, materials you access, and interactions with tutors and other users.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FaCheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-base-content mb-2">Technical Information</h3>
                                    <p className="text-sm leading-relaxed">
                                        We collect device information, IP addresses, browser type, and operating system to ensure
                                        optimal platform performance and security.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How We Use Your Information */}
                    <section className="bg-base-100 rounded-md shadow-md p-6 md:p-8 border border-base-300" data-aos="fade-left" >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                                <FaUserSecret className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-base-content">
                                How We Use Your Information
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <FaArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <p className="text-sm text-base-content/80">
                                        Provide and maintain our educational platform services
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <p className="text-sm text-base-content/80">
                                        Connect students with qualified tutors
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <p className="text-sm text-base-content/80">
                                        Process payments and manage subscriptions
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <FaArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <p className="text-sm text-base-content/80">
                                        Send important updates and notifications
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <p className="text-sm text-base-content/80">
                                        Improve our platform and user experience
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <p className="text-sm text-base-content/80">
                                        Ensure platform security and prevent fraud
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Data Protection */}
                    <section className="bg-base-100 rounded-md shadow-md p-6 md:p-8 border border-base-300" data-aos="flip-right">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                                <FaLock className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-base-content">
                                Data Protection & Security
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-success/10 rounded-md border border-success/20">
                                    <FaEye className="w-5 h-5 text-success" />
                                    <div>
                                        <h3 className="font-semibold text-base-content">Encryption</h3>
                                        <p className="text-sm text-base-content/70">
                                            All data is encrypted using industry-standard protocols
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-warning/10 rounded-md border border-warning/20">
                                    <FaEyeSlash className="w-5 h-5 text-warning" />
                                    <div>
                                        <h3 className="font-semibold text-base-content">Access Control</h3>
                                        <p className="text-sm text-base-content/70">
                                            Strict access controls and authentication measures
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-info/10 rounded-md border border-info/20">
                                    <FaShieldAlt className="w-5 h-5 text-info" />
                                    <div>
                                        <h3 className="font-semibold text-base-content">Regular Audits</h3>
                                        <p className="text-sm text-base-content/70">
                                            Regular security audits and vulnerability assessments
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-error/10 rounded-md border border-error/20">
                                    <FaExclamationTriangle className="w-5 h-5 text-error" />
        <div>
                                        <h3 className="font-semibold text-base-content">Incident Response</h3>
                                        <p className="text-sm text-base-content/70">
                                            Rapid response protocols for security incidents
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Cookies Policy */}
                    <section className="bg-base-100 rounded-md shadow-md p-6 md:p-8 border border-base-300" data-aos="fade-up">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                                <FaCookieBite className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-base-content">
                                Cookies & Tracking
                            </h2>
                        </div>
                        <div className="space-y-4 text-base-content/80">
                            <p className="text-sm leading-relaxed">
                                We use cookies and similar tracking technologies to enhance your experience on our platform.
                                These technologies help us:
                            </p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-center gap-2 text-sm">
                                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                                    Remember your preferences and login status
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                                    Analyze platform usage and performance
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                                    Provide personalized content and recommendations
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                                    Ensure platform security and prevent fraud
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Your Rights */}
                    <section className="bg-base-100 rounded-md shadow-md p-6 md:p-8 border border-base-300" data-aos="fade-up">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                                <FaHandshake className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-base-content">
                                Your Rights & Choices
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-base-200 rounded-md">
                                    <h3 className="font-semibold text-base-content mb-2">Access & Control</h3>
                                    <p className="text-sm text-base-content/70">
                                        You have the right to access, update, or delete your personal information at any time.
                                    </p>
                                </div>
                                <div className="p-4 bg-base-200 rounded-md">
                                    <h3 className="font-semibold text-base-content mb-2">Data Portability</h3>
                                    <p className="text-sm text-base-content/70">
                                        Request a copy of your data in a portable format for transfer to other services.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-base-200 rounded-md">
                                    <h3 className="font-semibold text-base-content mb-2">Opt-Out Options</h3>
                                    <p className="text-sm text-base-content/70">
                                        Choose to opt out of certain data collection and marketing communications.
                                    </p>
                                </div>
                                <div className="p-4 bg-base-200 rounded-md">
                                    <h3 className="font-semibold text-base-content mb-2">Complaints</h3>
                                    <p className="text-sm text-base-content/70">
                                        Contact us with any privacy concerns or file a complaint with relevant authorities.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-md p-6 md:p-8 border border-primary/20" data-aos="zoom-in">
                        <div className="text-center">
                            <h2 className="text-2xl md:text-3xl font-semibold text-base-content mb-4">
                                Questions About Privacy?
                            </h2>
                            <p className="text-base-content/80 mb-6 max-w-2xl mx-auto">
                                If you have any questions about this Privacy Policy or our data practices,
                                please don't hesitate to contact us.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant='primary' > <a
                                    href="mailto:privacy@edusync.com" className='inline-flex items-center gap-2'>  <FaEnvelope />
                                    Email Us</a>
                                </Button>
                                <Button variant='secondary' >
                                    <Link to='/contact-us'
                                        className="inline-flex items-center gap-2"> <FaArrowRight />
                                        Contact Us</Link>
                                </Button>

                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;