import React, { useState } from 'react';
import SectionTitle from '../../components/shared/SectionTitle';
import { FaHeadset, FaEnvelopeOpenText, FaPhoneAlt, FaQuestionCircle, FaChevronDown, FaExternalLinkAlt, FaComments, FaDownload, FaPaperPlane, FaUser, FaEnvelope, FaRegFileAlt } from 'react-icons/fa';
import { inputBase } from '../../utils/inputBase';

const faqs = [
  {
    question: "How do I book a study session?",
    answer: "Go to the Study Sessions page, browse available sessions, and click 'Book Now' on your preferred session. If payment is required, you'll be guided through the process."
  },
  {
    question: "How can I contact my tutor?",
    answer: "Once you book a session, you can message your tutor directly from your dashboard or via the session details page."
  },
  {
    question: "What if I forget my password?",
    answer: "Click 'Forgot Password' on the login page and follow the instructions to reset your password via email."
  },
  {
    question: "How do I become a tutor?",
    answer: "Sign up and select 'Tutor' as your role. Complete your profile and submit your credentials for admin approval."
  }
];

const Support = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Header */}
      <div className="bg-base-100 shadow-md pb-2" data-aos="fade-down">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center">
          <SectionTitle title="Support & Help Center" icon={<FaHeadset />} />
          <p className="text-base-content/70 max-w-xl mx-auto leading-relaxed">
            Need help? We're here for you! Find answers, contact our team, or explore resources to get the most out of Edu Sync.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-2 sm:px-4 py-10 flex flex-col gap-10">
        {/* Contact/Help Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-6 flex flex-col items-center gap-3" data-aos="fade-right">
            <FaEnvelopeOpenText className="text-primary text-3xl mb-1" />
            <h3 className="font-semibold text-base-content">Email Support</h3>
            <a href="mailto:support@edusync.com" className="text-primary hover:underline text-sm">support@edusync.com</a>
          </div>
          <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-6 flex flex-col items-center gap-3" data-aos="fade-left">
            <FaPhoneAlt className="text-primary text-3xl mb-1" />
            <h3 className="font-semibold text-base-content">Call Us</h3>
            <a href="tel:+8801740520249" className="text-primary hover:underline text-sm">+88 01740 520249</a>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-6" data-aos="fade-up">
          <div className="flex items-center gap-2 mb-4">
            <FaQuestionCircle className="text-primary text-xl" />
            <h2 className="text-lg sm:text-xl font-semibold text-base-content">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-base-300">
            {faqs.map((faq, idx) => (
              <div key={idx}>
                <button
                  className="w-full flex justify-between items-center py-3 text-left text-base-content/90 font-medium focus:outline-none"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  aria-expanded={openIndex === idx}
                >
                  <span>{faq.question}</span>
                  <FaChevronDown className={`transition-transform duration-200 ${openIndex === idx ? 'rotate-180 text-primary' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-40 py-2' : 'max-h-0 py-0'}`}>
                  <p className="text-base-content/70 text-sm">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-6 flex flex-col gap-3" data-aos="zoom-in">
          <h2 className="text-lg sm:text-xl font-semibold text-base-content mb-2 flex items-center gap-2">
            <FaExternalLinkAlt className="text-primary" /> Quick Links
          </h2>
          <a href="/about-us" className="text-primary hover:underline flex items-center gap-2 text-sm">
            About Us <FaExternalLinkAlt className="text-xs" />
          </a>
          <a href="/privacy-policy" className="text-primary hover:underline flex items-center gap-2 text-sm">
            Privacy Policy <FaExternalLinkAlt className="text-xs" />
          </a>
          <a href="/terms-of-service" className="text-primary hover:underline flex items-center gap-2 text-sm">
            Terms of Service <FaExternalLinkAlt className="text-xs" />
          </a>
          <a href="/cookie-policy" className="text-primary hover:underline flex items-center gap-2 text-sm">
            Cookie Policy <FaExternalLinkAlt className="text-xs" />
          </a>
        </div>

        {/* Live Chat CTA */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-md shadow-md border border-base-300 p-6 flex flex-col items-center gap-3 text-center" data-aos="fade-up">
          <FaComments className="text-primary text-3xl mb-1" />
          <h3 className="font-semibold text-base-content text-lg">Live Chat Support</h3>
          <p className="text-base-content/70 text-sm max-w-md">Need instant help? Our support team is available via live chat during business hours. Click below to start a chat session.</p>
          <button className="mt-2 px-6 py-2 bg-primary text-white rounded-md shadow-md hover:bg-primary/90 transition-colors flex items-center gap-2">
            <FaComments /> Start Live Chat
          </button>
        </div>

        {/* Resources/Downloads */}
        <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-6 flex flex-col gap-3" data-aos="fade-right">
          <h2 className="text-lg sm:text-xl font-semibold text-base-content mb-2 flex items-center gap-2">
            <FaDownload className="text-primary" /> Resources & Downloads
          </h2>
          <a href="/docs/user-guide.pdf" className="text-primary hover:underline flex items-center gap-2 text-sm" download>
            User Guide (PDF) <FaDownload className="text-xs" />
          </a>
          <a href="/docs/tutor-manual.pdf" className="text-primary hover:underline flex items-center gap-2 text-sm" download>
            Tutor Manual (PDF) <FaDownload className="text-xs" />
          </a>
          <a href="/docs/admin-quickstart.pdf" className="text-primary hover:underline flex items-center gap-2 text-sm" download>
            Admin Quickstart (PDF) <FaDownload className="text-xs" />
          </a>
        </div>

        {/* Feedback Form */}
        <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-6 flex flex-col gap-4" data-aos="fade-up">
          <h2 className="text-lg sm:text-xl font-semibold text-base-content mb-2 flex items-center gap-2">
            <FaPaperPlane className="text-primary" /> Send Us Feedback
          </h2>
          <form className="flex flex-col gap-3">
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
              <input type="text" placeholder="Your Name" className={inputBase} />
            </div>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
              <input type="email" placeholder="Your Email" className={inputBase} />
            </div>
            <div className="relative">
              <FaRegFileAlt className="absolute left-3 top-6 transform -translate-y-1/2 text-base-content/50 text-lg" />
              <textarea placeholder="Your Message" rows={4} className={inputBase + ' min-h-[100px] pl-10'} />
            </div>
            <button type="submit" className="mt-2 px-6 py-2 bg-primary text-white rounded-md shadow-md hover:bg-primary/90 transition-colors flex items-center gap-2">
              <FaPaperPlane /> Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Support;