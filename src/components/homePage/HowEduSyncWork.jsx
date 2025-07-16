import { FaUserPlus, FaUserEdit, FaSearch, FaCalendarCheck, FaChalkboardTeacher, FaChartLine } from 'react-icons/fa';

const steps = [
  {
    icon: <FaUserPlus />,
    title: 'Sign Up',
    desc: 'Create your free EduSync account in seconds to get started.',
    color: 'bg-primary',
    textColor: 'text-primary',
  },
  {
    icon: <FaUserEdit />,
    title: 'Set Up Profile',
    desc: 'Complete your profile to personalize your learning experience.',
    color: 'bg-secondary',
    textColor: 'text-secondary',
  },
  {
    icon: <FaSearch />,
    title: 'Browse Sessions',
    desc: 'Explore or search for study sessions that match your interests.',
    color: 'bg-blue-600',
    textColor: 'text-blue-600',
  },
  {
    icon: <FaCalendarCheck />,
    title: 'Book or Join',
    desc: 'Book a session in advance or join one instantly.',
    color: 'bg-green-500',
    textColor: 'text-green-600',
  },
  {
    icon: <FaChalkboardTeacher />,
    title: 'Learn & Interact',
    desc: 'Participate in live sessions, ask questions, and collaborate.',
    color: 'bg-yellow-400',
    textColor: 'text-yellow-600',
  },
  {
    icon: <FaChartLine />,
    title: 'Track Progress',
    desc: 'Monitor your learning journey and celebrate your achievements.',
    color: 'bg-red-500',
    textColor: 'text-red-600',
  },
];

const positions = [
  { top: '0', left: '50%', transform: 'translate(-50%, 0)' },      // 12 o'clock
  { top: '18%', left: '85%', transform: 'translate(-50%, 0)' },    // 2 o'clock
  { top: '65%', left: '80%', transform: 'translate(-50%, 0)' },    // 4 o'clock
  { top: '90%', left: '50%', transform: 'translate(-50%, 0)' },    // 6 o'clock
  { top: '65%', left: '20%', transform: 'translate(-50%, 0)' },    // 8 o'clock
  { top: '18%', left: '15%', transform: 'translate(-50%, 0)' },    // 10 o'clock
];

const HowEduSyncWork = () => {
  return (
    <section data-aos="zoom-in" className="bg-base-200/40 py-16 px-4 rounded-md">
      <h2 className='mb-10 md:mb-12 text-center text-2xl md:text-3xl font-bold'>How EduSync Works</h2>
      {/* Desktop: Circular Layout */}
      <div className="relative w-full max-w-2xl mx-auto h-[450px] hidden md:block">
        {/* Center Circle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/90 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-primary/80 z-20">
          <span className="text-center font-bold text-2xl text-white tracking-wide">EduSync<br />Website</span>
        </div>
        {/* Step Items */}
        {steps.map((step, idx) => (
          <div key={idx} className="absolute flex items-center gap-4 w-52 z-10" style={positions[idx]}>
            <div className={`w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center shadow text-white text-3xl ${step.color} transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-md cursor-pointer`}>
              {step.icon}
            </div>
            <div className="flex-grow">
              <h3 className={`font-bold text-base md:text-lg ${step.textColor}`}>{step.title}</h3>
              <p className="text-xs text-base-content/90 leading-snug">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Mobile: Stack Steps Vertically */}
      <div className="flex flex-col gap-5 md:hidden mt-8">
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-primary/90 rounded-full flex items-center justify-center shadow-md">
            <span className="text-center font-bold text-xl text-white tracking-wide">EduSync<br />Website</span>
          </div>
        </div>
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-4 w-full  rounded-md shadow p-4">
            <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center shadow text-white text-xl ${step.color} transition-transform duration-300 ease-in-out  hover:-translate-y-2 hover:shadow-md cursor-pointer`}>
              {step.icon}
            </div>
            <div className="flex-grow">
              <h3 className={`font-bold text-base ${step.textColor}`}>{step.title}</h3>
              <p className="text-xs text-base-content/90 leading-snug">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowEduSyncWork; 