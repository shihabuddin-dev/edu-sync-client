import React from 'react';
import Button from '../ui/Button';

const Banner = () => {
    return (
        <section
            className="-mt-5 md:-mt-10 relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden rounded-b-md shadow-md border border-base-content/10 my-6"
        >
            {/* Background image */}
            <img
                src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80"
                alt="Collaborative Study Background"
                className="absolute inset-0 w-full h-full object-cover object-center z-0"
                loading="lazy"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-base-100/20 to-base-200/30 z-10" />
            {/* Content */}
            <div className="relative z-20 max-w-2xl mx-auto px-4 py-12 text-center flex flex-col items-center justify-center">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
                    Empower Your Learning Journey
                </h1>
                <p className="text-base md:text-lg text-white/90 mb-6 drop-shadow">
                    Connect with students and tutors, schedule collaborative study sessions, and access shared resources—all in one modern platform.
                </p>
                <Button onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}>
                    Get Started
                </Button>
            </div>
        </section>
    );
};

export default Banner;