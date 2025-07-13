import React from 'react';
import { FaBullhorn, FaTag, FaUsers, FaExclamationCircle, FaLink, FaStar, FaRegSmile, FaCalendarAlt } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../../components/ui/Spinner';
import useAxios from '../../hooks/useAxios';
import SectionTitle from '../../components/shared/SectionTitle';
import { useState } from 'react';

const AnnouncementsList = () => {
    const axiosInstance = useAxios();
    const { data: announcements = [], isLoading } = useQuery({
        queryKey: ['announcements'],
        queryFn: async () => {
            const res = await axiosInstance.get('/announcements');
            return res.data;
        }
    });

    const [filter, setFilter] = useState('all');

    // Filtered announcements based on audience
    const filteredAnnouncements = announcements.filter(a => {
        if (filter === 'all') return true;
        if (filter === 'students') return a.audience === 'students';
        if (filter === 'tutors') return a.audience === 'tutors';
        return true;
    });

    // Stats (static + dynamic)
    const total = filteredAnnouncements.length;
    const featured = filteredAnnouncements.filter(a => a.priority === 'featured').length;
    const important = filteredAnnouncements.filter(a => a.priority === 'important').length;
    const studentCount = filteredAnnouncements.filter(a => a.audience === 'students').length;
    const tutorCount = filteredAnnouncements.filter(a => a.audience === 'tutors').length;

    // Featured/Recent Announcements (top 2 by date or priority)
    const featuredAnnouncements = filteredAnnouncements
        .filter(a => a.priority === 'featured' || a.priority === 'important')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 2);

    if (isLoading) return <Spinner />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
            {/* Header Section */}
            <div className="bg-base-100 shadow-md pb-2" data-aos="fade-up-right">
                <div className="max-w-4xl mx-auto px-4 py-4 text-center">
                    <SectionTitle title="Announcements" icon={<FaBullhorn />} />
                    <p className="text-base-content/70 max-w-2xl mx-auto leading-relaxed">
                        Stay up to date with the latest news, updates, and important information from Edu Sync. Our announcements keep you informed and connected with our vibrant learning community.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-2 sm:px-4 py-12">
                {/* Filter Bar */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    <button
                        className={`cursor-pointer px-3 py-1 rounded-md border transition ${filter === 'all'
                            ? 'bg-primary text-white border-primary'
                            : ' text-base-content border-base-300 bg-primary/6'
                            }`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`cursor-pointer px-3 py-1 rounded-md border transition ${filter === 'students'
                            ? 'bg-primary text-white border-primary'
                            : ' text-base-content border-base-300 bg-primary/6'
                            }`}
                        onClick={() => setFilter('students')}
                    >
                        Students
                    </button>
                    <button
                        className={`cursor-pointer px-3 py-1 rounded-md border transition ${filter === 'tutors'
                            ? 'bg-primary text-white border-primary'
                            : ' text-base-content border-base-300 bg-primary/6'
                            }`}
                        onClick={() => setFilter('tutors')}
                    >
                        Tutors
                    </button>
                </div>
                {/* Impact/Stats Section */}
                <section className="bg-base-100/60 backdrop-blur-md rounded-md shadow-md border border-base-300 p-4 sm:p-6 md:p-8 mb-8" data-aos="zoom-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                        <div className="duration-500 transform hover:-translate-y-2 hover:shadow-primary hover:shadow-md flex flex-col items-center gap-2 p-4 rounded-md bg-primary/5 shadow z-10">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-2 text-2xl shadow-md">
                                <FaBullhorn className="text-primary" />
                            </div>
                            <span className="text-2xl font-semibold text-primary drop-shadow">{total}</span>
                            <span className="text-base-content/80 text-xs sm:text-sm text-center">Total Announcements</span>
                        </div>
                        <div className="duration-500 transform hover:-translate-y-2 hover:shadow-primary hover:shadow-md flex flex-col items-center gap-2 p-4 rounded-md bg-warning/5 shadow z-10">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-warning/10 mb-2 text-2xl shadow-md">
                                <FaExclamationCircle className="text-warning" />
                            </div>
                            <span className="text-2xl font-semibold text-warning drop-shadow">{important}</span>
                            <span className="text-base-content/80 text-xs sm:text-sm text-center">Important</span>
                        </div>
                        <div className="duration-500 transform hover:-translate-y-2 hover:shadow-primary hover:shadow-md flex flex-col items-center gap-2 p-4 rounded-md bg-secondary/5 shadow z-10">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary/10 mb-2 text-2xl shadow-md">
                                <FaStar className="text-secondary" />
                            </div>
                            <span className="text-2xl font-semibold text-secondary drop-shadow">{featured}</span>
                            <span className="text-base-content/80 text-xs sm:text-sm text-center">Featured</span>
                        </div>
                        <div className="duration-500 transform hover:-translate-y-2 hover:shadow-primary hover:shadow-md flex flex-col items-center gap-2 p-4 rounded-md bg-info/5 shadow z-10">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-info/10 mb-2 text-2xl shadow-md">
                                <FaUsers className="text-info" />
                            </div>
                            <span className="text-2xl font-semibold text-info drop-shadow">{studentCount}</span>
                            <span className="text-base-content/80 text-xs sm:text-sm text-center">Student Announcements</span>
                        </div>
                        <div className="duration-500 transform hover:-translate-y-2 hover:shadow-primary hover:shadow-md flex flex-col items-center gap-2 p-4 rounded-md bg-accent/5 shadow z-10">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/10 mb-2 text-2xl shadow-md">
                                <FaUsers className="text-accent" />
                            </div>
                            <span className="text-2xl font-semibold text-accent drop-shadow">{tutorCount}</span>
                            <span className="text-base-content/80 text-xs sm:text-sm text-center">Tutor Announcements</span>
                        </div>
                    </div>
                </section>

                {/* Featured Announcements Section */}
                {featuredAnnouncements.length > 0 && (
                    <section className="mb-8" data-aos="fade-up">
                        <h2 className="text-xl md:text-2xl font-semibold text-base-content mb-6 text-center flex items-center gap-2 justify-center">
                            <FaStar className="text-secondary" /> Featured & Important
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {featuredAnnouncements.map(a => (
                                <div key={a._id} className="card bg-gradient-to-br from-primary/10 to-base-100 shadow-md border border-primary/30 p-0 overflow-hidden flex flex-col">
                                    {a.imageUrl && (
                                        <div className="h-44 bg-base-200 flex items-center justify-center overflow-hidden">
                                            <img src={a.imageUrl} alt={a.title} className="object-cover w-full h-full" />
                                        </div>
                                    )}
                                    <div className="p-5 flex-1 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaBullhorn className="text-primary" />
                                            <span className="font-bold text-lg">{a.title}</span>
                                            {a.priority && a.priority !== 'normal' && (
                                                <span className={`badge ml-2 flex items-center gap-1 ${a.priority === 'featured' ? 'bg-secondary/80 text-secondary-content' : 'bg-warning/80 text-warning-content'}`}><FaExclamationCircle /> {a.priority}</span>
                                            )}
                                        </div>
                                        <div className="text-base-content/80 mb-2 whitespace-pre-line">{a.message}</div>
                                        <div className="flex flex-wrap gap-3 text-xs text-base-content/60 mt-2">
                                            {a.category && (
                                                <span className="badge bg-primary/80 text-primary-content px-2 py-1 rounded-full flex items-center gap-1 font-semibold"><FaTag /> {a.category}</span>
                                            )}
                                            {a.audience && (
                                                <span className="badge bg-secondary/80 text-secondary-content px-2 py-1 rounded-full flex items-center gap-1 font-semibold"><FaUsers /> {a.audience}</span>
                                            )}
                                            {a.link && (
                                                <a href={a.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 link link-primary"><FaLink /> Link</a>
                                            )}
                                            <span className="ml-auto font-mono text-xs text-base-content/40">{a.created_at ? new Date(a.created_at).toLocaleString() : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* All Announcements Grid */}
                <section className="mb-8" data-aos="fade-up">
                    <h2 className="text-xl md:text-2xl font-semibold text-base-content mb-6 text-center flex items-center gap-2 justify-center">
                        <FaBullhorn className="text-primary" /> All Announcements
                    </h2>
                    {filteredAnnouncements.length === 0 ? (
                        <div className="text-base-content/70 text-lg text-center py-12">
                            No announcements yet. Stay tuned!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredAnnouncements.map(a => (
                                <div key={a._id} className="card bg-base-100 shadow-md border border-base-200 p-0 overflow-hidden flex flex-col">
                                    {a.imageUrl && (
                                        <div className="h-44 bg-base-200 flex items-center justify-center overflow-hidden">
                                            <img src={a.imageUrl} alt={a.title} className="object-cover w-full h-full" />
                                        </div>
                                    )}
                                    <div className="p-5 flex-1 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaBullhorn className="text-primary" />
                                            <span className="font-bold text-lg">{a.title}</span>
                                            {a.priority && a.priority !== 'normal' && (
                                                <span className={`badge ml-2 flex items-center gap-1 ${a.priority === 'featured' ? 'bg-secondary/80 text-secondary-content' : 'bg-warning/80 text-warning-content'}`}><FaExclamationCircle /> {a.priority}</span>
                                            )}
                                        </div>
                                        <div className="text-base-content/80 mb-2 whitespace-pre-line">{a.message}</div>
                                        <div className="flex flex-wrap gap-3 text-xs text-base-content/60 mt-2">
                                            {a.category && (
                                                <span className="badge bg-primary/80 text-primary-content px-2 py-1 rounded-full flex items-center gap-1 font-semibold"><FaTag /> {a.category}</span>
                                            )}
                                            {a.audience && (
                                                <span className="badge bg-secondary/80 text-secondary-content px-2 py-1 rounded-full flex items-center gap-1 font-semibold"><FaUsers /> {a.audience}</span>
                                            )}
                                            {a.link && (
                                                <a href={a.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 link link-primary"><FaLink /> Link</a>
                                            )}
                                            <span className="ml-auto font-mono text-xs text-base-content/40">{a.created_at ? new Date(a.created_at).toLocaleString() : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Community/Info Section */}
                <section className="bg-base-100 rounded-md shadow-md border border-base-300 p-6 md:p-8 mt-8 flex flex-col items-center gap-4 md:gap-6" data-aos="fade-up">
                    <div className="flex items-center gap-2 md:gap-4 mb-4">
                        <FaRegSmile className="text-success text-3xl" />
                        <FaCalendarAlt className="text-primary text-3xl" />
                        <FaStar className="text-warning text-3xl" />
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-base-content mb-2">Stay Connected</h2>
                    <p className="text-base-content/80 text-xs sm:text-sm md:text-base text-center max-w-2xl">
                        Join our community to get the latest updates, participate in discussions, and never miss an important announcement. Edu Sync is here to empower your learning journey!
                    </p>
                </section>
            </div>
        </div>
    );
};

export default AnnouncementsList; 