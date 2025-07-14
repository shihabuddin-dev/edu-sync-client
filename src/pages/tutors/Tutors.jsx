import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import Spinner from '../../components/ui/Spinner';
import SectionTitle from '../../components/shared/SectionTitle';
import { FaUsers } from 'react-icons/fa';

const Tutors = () => {
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
            <div className="text-center text-red-500 py-10">
                Failed to load tutors: {error.message}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
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
                        <div className="text-center text-gray-500">No tutors found.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {tutors.map((tutor, idx) => (
                                <div
                                    key={tutor._id || idx}
                                    className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300"
                                >
                                    <img
                                        src={tutor.photoURL || '/default-avatar.png'}
                                        alt={tutor.name || 'Tutor'}
                                        className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-blue-200 shadow"
                                        onError={e => { e.target.src = '/default-avatar.png'; }}
                                    />
                                    <h3 className="text-xl font-semibold mb-1 text-gray-800">{tutor.name || 'Unknown Tutor'}</h3>
                                    {tutor.created_at && (
                                        <p className="text-sm text-gray-500 mb-1">
                                            Joined {new Date(tutor.created_at).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </p>
                                    )}
                                    {/* You can add more fields here, e.g. bio, expertise, etc. */}
                                    {/* Email is intentionally hidden */}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Tutors;