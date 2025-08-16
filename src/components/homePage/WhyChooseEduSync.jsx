import { FaUserGraduate, FaClock, FaComments, FaChartBar, FaGlobe, FaShieldAlt } from 'react-icons/fa';
import { Link } from 'react-router';
import Button from '../ui/Button';

const features = [
    {
        icon: <FaUserGraduate className="text-3xl text-primary" />,
        title: "Expert Tutors",
        desc: "Learn from experienced, certified educators."
    },
    {
        icon: <FaClock className="text-3xl text-primary" />,
        title: "Flexible Scheduling",
        desc: "Join sessions anytime, anywhere."
    },
    {
        icon: <FaComments className="text-3xl text-primary" />,
        title: "Interactive Learning",
        desc: "Live Q&A, group discussions, and collaborative tools."
    },
    {
        icon: <FaChartBar className="text-3xl text-primary" />,
        title: "Progress Tracking",
        desc: "Monitor your achievements and set goals."
    },
    {
        icon: <FaGlobe className="text-3xl text-primary" />,
        title: "Global Community",
        desc: "Connect with learners and tutors worldwide."
    },
    {
        icon: <FaShieldAlt className="text-3xl text-primary" />,
        title: "Secure & Reliable",
        desc: "Your data and learning are always safe."
    },
];

const WhyChooseEduSync = () => (
    <section>
        <h2 className='mb-2 md:mb-4 text-center text-2xl md:text-3xl font-bold'>Why Choose EduSync?</h2>
        <p className="text-center text-base-content/80 mb-8 md:mb-10 text-base md:text-lg max-w-2xl mx-auto">Empowering your learning journey with trusted tutors, flexible sessions, and a vibrant community.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {features.map((feature, idx) => (
                <div data-aos="flip-left"
                    data-aos-easing="ease-out-cubic"
                    data-aos-duration="1500" key={idx} className="flex flex-col items-center bg-base-200/60 rounded-md shadow px-6 py-8 hover:shadow-md transition">
                    {feature.icon}
                    <h3 className="mt-4 font-bold text-lg text-center">{feature.title}</h3>
                    <p className="text-base-content/80 text-center text-sm mt-2">{feature.desc}</p>
                </div>
            ))}
        </div>
        <div className="text-center mt-8"><Link to="/statistic"><Button className="btn"><FaChartBar /> See Site Statistic</Button></Link></div>
    </section>
);

export default WhyChooseEduSync; 