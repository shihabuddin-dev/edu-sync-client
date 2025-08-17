import React, { useState } from 'react';
import { FaMobileAlt, FaGooglePlay, FaApple, FaTablet, FaDesktop }
    from 'react-icons/fa';
import Button from '../ui/Button';
import phone from '../../assets/devices/phone.png'
import tab from '../../assets/devices/tablet.png'
import desk from '../../assets/devices/desktop.png'

const DeviceSupport = () => {
    const [activeTab, setActiveTab] = useState('mobile');

    const tabData = {
        mobile: {
            title: 'EduSync On The Go',
            description:
                'Access live study sessions, resources, and your learning dashboard from anywhere with the EduSync mobile app. Stay connected and keep learning on both Android and iOS devices.',
            img: phone,
            details: [
                'Instant notifications for session updates and reminders',
                'Join or schedule sessions with a tap',
                'Easy access to study materials and notes',
                'Seamless chat and collaboration tools',
                'Track your progress on the go',
            ],
        },
        tablet: {
            title: 'Tablet Learning Experience',
            description:
                'Enjoy EduSync on your tablet with a spacious, responsive interface. Perfect for group study, interactive lessons, and multitasking with split screen features.',
            img: tab,
            details: [
                'Large, touch-friendly controls for easy navigation',
                'Great for collaborative group sessions',
                'View multiple resources side by side',
                'Annotate PDFs and notes with your stylus',
                'Syncs seamlessly with your EduSync account',
            ],
        },
        desktop: {
            title: 'Full EduSync Web Platform',
            description:
                'Unlock the complete EduSync experience on your desktop or laptop. Manage sessions, explore analytics, and access all features with a powerful, user friendly interface.',
            img: desk,
            details: [
                'Comprehensive dashboard for all your learning needs',
                'Advanced search and filtering for sessions and resources',
                'Detailed analytics to track your learning journey',
                'Multi-tab browsing for multitasking',
                'Best for in depth study and resource management',
            ],
        },
    };

    const tabs = [
        { key: 'mobile', label: 'Mobile', icon: <FaMobileAlt /> },
        { key: 'tablet', label: 'Tablet', icon: <FaTablet /> },
        { key: 'desktop', label: 'Desktop', icon: <FaDesktop /> },
    ];

    const { title, description, img, details } = tabData[activeTab];

    return (
        <div className="max-w-7xl mx-auto px-4 bg-base-100" data-aos="flip-left"
            data-aos-easing="ease-out-cubic"
            data-aos-duration="1000">
            <div className="max-w-5xl mx-auto">
                <h2 className='mb-2 md:mb-4 text-center text-2xl md:text-3xl font-bold'>Device Support</h2>
                <p className="text-center text-base-content/80 mb-8 md:mb-10 text-base md:text-lg max-w-2xl mx-auto">Access EduSync seamlessly on mobile, tablet, or desktop anytime, anywhere, on any device.</p>
                <div className="flex justify-center mb-8 md:mb-12">
                    <div className="flex rounded-md border border-secondary/20 overflow-hidden bg-base-100 shadow-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                className={`px-6 py-2 flex items-center gap-2 border-primary font-medium text-sm md:text-base transition-all duration-300 focus:outline-none  ${activeTab === tab.key
                                    ? 'bg-primary border-primary text-white shadow font-bold'
                                    : 'text-primary hover:bg-primary/10 bg-base-100'
                                    }`}
                                aria-pressed={activeTab === tab.key}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="border border-primary/20 rounded-md shadow p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 bg-base-100">
                    <div className="md:w-1/2 flex justify-center">
                        <div className="w-full max-w-xs md:max-w-sm rounded-md p-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 flex items-center justify-center">
                            <img src={img} alt={title} className="rounded-md w-full object-contain drop-shadow-md" />
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <h3 className="text-xl md:text-2xl font-bold text-primary mb-3">{title}</h3>
                        <p className="text-base-content text-base mb-3">{description}</p>
                        <ul className="list-disc pl-5 text-base-content text-sm mb-3 space-y-1">
                            {details && details.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                        {activeTab === 'mobile' && (
                            <div className="flex gap-3 mt-4">
                                <a href="https://play.google.com/" target='blank'>
                                    <Button type="button" className="btn">
                                        <FaGooglePlay /> Google Play
                                    </Button>
                                </a>
                                <a href="https://www.apple.com/app-store/" target='blank'>
                                    <Button type="button" className="btn">
                                        <FaApple /> App Store
                                    </Button>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceSupport;