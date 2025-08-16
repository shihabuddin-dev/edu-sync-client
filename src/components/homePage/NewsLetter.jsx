import React, { useState } from 'react';
import { FaPaperPlane, FaEnvelope } from 'react-icons/fa';
import NewsLatterMan from '../../assets/NewsLatterMan.png';
import { inputBase } from '../../utils/inputBase';
import Button from '../ui/Button';

const NewsLetter = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setSubmitted(true);
    };

    return (
        <section className="max-w-5xl mx-auto">
            <h2 className='mb-2 md:mb-4 text-center text-2xl md:text-3xl font-bold'>Newsletter Signup</h2>
            <p className="text-center text-base-content/80 mb-8 md:mb-10 text-base md:text-lg max-w-2xl mx-auto">Stay up to date with the latest news, exclusive updates, and resources from EduSync. Join our newsletter today!</p>
            <div className="relative flex flex-col-reverse md:flex-row items-center bg-base-100 rounded-md shadow-md border border-base-300 overflow-hidden px-4 py-8">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-primary via-pink-400 to-secondary opacity-30" />
                {/* Animated Blob */}
                <svg className="absolute right-0 top-0 w-48 h-48 opacity-30 pointer-events-none z-0 animate-blob-move" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <radialGradient id="blobGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor="#6366F1" />
                            <stop offset="100%" stopColor="#F472B6" />
                        </radialGradient>
                    </defs>
                    <path fill="url(#blobGradient)" d="M320,60Q340,120,320,180Q300,240,240,260Q180,280,120,260Q60,240,80,180Q100,120,160,80Q220,40,280,60Q320,60,320,60Z" />
                </svg>
                {/* Content Left */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-start text-left z-10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Get the latest updates and free resources.</h2>
                    <p className="text-base-content/80 mb-6">Subscribe to our newsletter and never miss out!</p>
                    {submitted ? (
                        <div className="text-success font-semibold py-4">Thank you for subscribing!</div>
                    ) : (
                        <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3 items-center">
                            <div className="relative w-full sm:w-auto flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-lg">
                                    <FaEnvelope />
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className={inputBase + ' w-full sm:w-auto flex-1 pl-10'}
                                    aria-label="Email address"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className='btn'
                            >
                                <FaPaperPlane />
                                Subscribe
                            </Button>
                        </form>
                    )}
                    {error && <div className="text-error mt-2">{error}</div>}
                </div>
                {/* Image Right - reduced height, fixed to bottom */}
                <div className="w-full md:w-1/2 flex items-center justify-center md:items-end relative p-0 md:p-0 z-10 min-h-[180px] md:min-h-[250px]" style={{ height: '100%' }}>
                    <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-40 h-54 bg-gradient-to-br from-primary/20 to-pink-400/10 rounded-full blur-2xl opacity-50 -z-10" />
                    <img
                        src={NewsLatterMan}
                        alt="Newsletter signup illustration"
                        className="w-auto h-48 sm:h-64 md:h-86 object-contain md:rounded-none rounded-b-md drop-shadow-md
            md:absolute md:bottom-[-32px] md:left-0 md:right-0 md:mx-auto
        "
                        style={{
                            minHeight: 180,
                            maxHeight: 280,
                            // Only apply absolute positioning on md and up
                            position: undefined
                        }}
                    />
                </div>
            </div>
            <style>{`
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradientMove 6s ease-in-out infinite;
                }
                @keyframes gradientMove {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-blob-move {
                    animation: blobMove 8s ease-in-out infinite alternate;
                }
                @keyframes blobMove {
                    0% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.05); }
                    100% { transform: translateY(0) scale(1); }
                }
            `}</style>
        </section>
    );
};

export default NewsLetter;