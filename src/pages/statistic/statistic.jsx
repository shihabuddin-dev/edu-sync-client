import React from 'react';
import PublicStatistics from '../../components/charts/PublicStatistics';
import SectionTitle from '../../components/shared/SectionTitle';
import { FaChartBar, FaQuestionCircle } from 'react-icons/fa';
import Button from '../../components/ui/Button';

const Statistic = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
             <title>Statistic | Edu Sync</title>
            {/* Header Section */}
            <div className="bg-base-100 shadow-md pb-2" data-aos="fade-up-right">
                <div className="max-w-4xl mx-auto px-4 py-4 text-center">
                    <SectionTitle title="Statistic" icon={<FaChartBar />} />
                    <p className="text-base-content/70 max-w-2xl mx-auto leading-relaxed">
                        Edu Sync connects students, tutors, and admins for easy scheduling, resource sharing, and collaborative learning—all in a secure, user-friendly platform.
                    </p>
                </div>
            </div>
            <div className='max-w-5xl mx-auto mt-8 py-8'>
                <PublicStatistics />
            </div>
            {/* Statistic Support/Help Section */}
            <div className="max-w-5xl mx-auto mt-8 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Statistic Help Card */}
                    <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-6 flex flex-col items-center gap-3">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
                            <FaChartBar className="text-primary text-2xl" />
                        </span>
                        <h3 className="font-semibold text-base-content text-lg">Need Help Understanding the Statistics?</h3>
                        <p className="text-base-content/70 text-sm text-center">Our statistics dashboard provides insights into study session trends, tutor specialties, and platform activity. If you have questions or need a walkthrough, our support team is here to help!</p>
                        <Button className='btn btn-sm'> <a href="https://shihab-dev.web.app/" target='blank' >Contact Support</a></Button>
                    </div>
                    {/* Statistic FAQ Card */}
                    <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-6 flex flex-col gap-3">
                        <h3 className="font-semibold text-base-content text-lg flex items-center gap-2"><FaQuestionCircle className="text-primary" /> Statistic FAQs</h3>
                        <div className="divide-y divide-base-300">
                            <div className="py-2">
                                <span className="font-medium text-base-content">What do the charts show?</span>
                                <p className="text-base-content/70 text-sm">The bar and pie charts visualize registration fees, session durations, announcement categories, and tutor specialties to help you understand platform trends.</p>
                            </div>
                            <div className="py-2">
                                <span className="font-medium text-base-content">How often is the data updated?</span>
                                <p className="text-base-content/70 text-sm">Statistics are updated in real-time as new sessions, announcements, and tutors are added to Edu Sync.</p>
                            </div>
                            <div className="py-2">
                                <span className="font-medium text-base-content">Can I download the data?</span>
                                <p className="text-base-content/70 text-sm">Currently, data export is not available, but you can contact support for custom reports or data requests.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* design  */}
        </div>
    );
};

export default Statistic;