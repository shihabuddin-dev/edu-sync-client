import React from 'react';
import PublicStatistics from '../../components/charts/PublicStatistics';
import SectionTitle from '../../components/shared/SectionTitle';
import { FaChartBar } from 'react-icons/fa';

const Statistic = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
            {/* Header Section */}
            <div className="bg-base-100 shadow-md pb-2" data-aos="fade-up-right">
                <div className="max-w-4xl mx-auto px-4 py-4 text-center">
                    <SectionTitle title="Statistic" icon={<FaChartBar />} />
                    <p className="text-base-content/70 max-w-2xl mx-auto leading-relaxed">
                        Edu Sync empowers students, tutors, and administrators to connect, collaborate, and thrive. Our modern platform makes it easy to schedule study sessions, share resources, and manage learning—all in a secure, user-friendly environment designed for everyone, everywhere.
                    </p>
                </div>
            </div>
            <div className='max-w-5xl mx-auto mt-8 py-8'>
                <PublicStatistics />
            </div>
        </div>
    );
};

export default Statistic;