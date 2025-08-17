import React from 'react';
import Button from '../ui/Button';
import banner from '../../assets/banner/banner1.jpg';
import { FaRocket, FaGraduationCap, FaLightbulb, FaGlobeAmericas } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Banner = () => {
    // Animated icon variants for unique, smooth movement
    const iconVariants = {
        topLeft: {
            animate: { x: [0, -20, 0, 20, 0], y: [0, -10, 0, 10, 0] },
            transition: { repeat: Infinity, duration: 6, ease: 'easeInOut' }
        },
        topRight: {
            animate: { x: [0, 20, 0, -20, 0], y: [0, -15, 0, 15, 0] },
            transition: { repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 0.5 }
        },
        bottomLeft: {
            animate: { x: [0, -15, 0, 15, 0], y: [0, 20, 0, -20, 0] },
            transition: { repeat: Infinity, duration: 7.5, ease: 'easeInOut', delay: 0.2 }
        },
        bottomRight: {
            animate: { x: [0, 15, 0, -15, 0], y: [0, 25, 0, -25, 0] },
            transition: { repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 0.7 }
        }
    };

    return (
        <section
            className="-mt-5 md:-mt-10 relative w-full min-h-[68vh] flex items-center justify-center overflow-hidden rounded-b-md shadow-md border border-base-content/10 my-6"
        >
            {/* Background image */}
            <img
                src={banner}
                alt="Collaborative Study Background"
                className="absolute inset-0 w-full h-full object-cover object-center z-0"
                loading="lazy"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-base-100/10 to-primary/30 z-10" />
            {/* Animated Corner Icons with unique smooth movement */}
            <motion.div
                className="hidden md:block absolute top-8 left-8 z-20"
                animate={iconVariants.topLeft.animate}
                transition={iconVariants.topLeft.transition}
            >
                <FaRocket className="text-pink-500 text-5xl drop-shadow-lg opacity-90" />
            </motion.div>
            <motion.div
                className="hidden md:block absolute top-8 right-8 z-20"
                animate={iconVariants.topRight.animate}
                transition={iconVariants.topRight.transition}
            >
                <FaGraduationCap className="text-blue-500 text-5xl drop-shadow-lg opacity-90" />
            </motion.div>
            <motion.div
                className="hidden md:block absolute bottom-8 left-8 z-20"
                animate={iconVariants.bottomLeft.animate}
                transition={iconVariants.bottomLeft.transition}
            >
                <FaLightbulb className="text-yellow-400 text-5xl drop-shadow-lg opacity-90" />
            </motion.div>
            <motion.div
                className="hidden md:block absolute bottom-8 right-8 z-20"
                animate={iconVariants.bottomRight.animate}
                transition={iconVariants.bottomRight.transition}
            >
                <FaGlobeAmericas className="text-green-500 text-5xl drop-shadow-lg opacity-90" />
            </motion.div>
            {/* Content */}
            <div className="backdrop-blur-xs text-white relative rounded-ms z-20 max-w-2xl mx-auto px-4 py-12 text-center flex flex-col items-center justify-center">
                <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg mb-4">
                    Empower Your Learning Journey
                </h1>
                <p className="text-base md:text-lg text-white/90 mb-6 drop-shadow">
                    Connect with students and tutors, schedule collaborative study sessions, and access shared resources all in one modern platform.
                </p>
                <Button onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}>
                    Get Started
                </Button>
            </div>
        </section>
    );
};

export default Banner;