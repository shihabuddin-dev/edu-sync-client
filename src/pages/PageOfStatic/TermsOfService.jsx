import React from 'react';
import { FaGavel, FaRegCheckCircle, FaExclamationTriangle, FaUserShield, FaHandshake, FaArrowRight } from 'react-icons/fa';
import SectionTitle from '../../components/shared/SectionTitle';
import Button from '../../components/ui/Button';
import { Link } from 'react-router';

const TermsOfService = () => {
  const currentYear = new Date().getFullYear();

    return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Header Section */}
      <div className="bg-base-100 shadow-md" data-aos="fade-up-right">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center">
          <SectionTitle title="Terms of Service" icon={<FaGavel />} />
          <p className="text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            Please read these Terms of Service carefully before using Edu Sync. By accessing or using our platform, you agree to be bound by these terms.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-base-content/60">
            <FaHandshake className="text-primary" />
            <span>Last updated: {currentYear}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="space-y-8">

          {/* Acceptance of Terms */}
          <section className="bg-base-100 rounded-md shadow-md p-6 md:p-8 border border-base-300" data-aos="fade-up">
            <div className="flex items-center gap-3 mb-6">
              <FaRegCheckCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-base-content">
                Acceptance of Terms
              </h2>
            </div>
            <p className="text-base-content/80 text-sm leading-relaxed">
              By registering for or using Edu Sync, you agree to comply with and be legally bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          {/* User Responsibilities */}
          <section className="bg-base-100 rounded-md shadow-md p-6 md:p-8 border border-base-300" data-aos="fade-left">
            <div className="flex items-center gap-3 mb-6">
              <FaUserShield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-base-content">
                User Responsibilities
              </h2>
            </div>
            <ul className="space-y-3 ml-4 text-base-content/80 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Provide accurate and up-to-date information during registration.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Maintain the confidentiality of your account credentials.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Use the platform for lawful and educational purposes only.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Respect the rights and privacy of other users.
              </li>
            </ul>
          </section>

          {/* Prohibited Activities */}
          <section className="bg-base-100 rounded-md shadow-md p-6 md:p-8 border border-base-300" data-aos="flip-right">
            <div className="flex items-center gap-3 mb-6">
              <FaExclamationTriangle className="w-6 h-6 text-error" />
              <h2 className="text-2xl font-semibold text-base-content">
                Prohibited Activities
              </h2>
            </div>
            <ul className="space-y-3 ml-4 text-base-content/80 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-error rounded-full"></span>
                Engaging in any form of harassment, abuse, or discrimination.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-error rounded-full"></span>
                Attempting to gain unauthorized access to other accounts or data.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-error rounded-full"></span>
                Uploading malicious software or content.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-error rounded-full"></span>
                Violating any applicable laws or regulations.
              </li>
            </ul>
          </section>

          {/* Termination */}
          <section className="bg-base-100 rounded-md shadow-md p-6 md:p-8 border border-base-300" data-aos="fade-up">
            <div className="flex items-center gap-3 mb-6">
              <FaHandshake className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-base-content">
                Termination
              </h2>
            </div>
            <p className="text-base-content/80 text-sm leading-relaxed">
              Edu Sync reserves the right to suspend or terminate your access to the platform at any time for violations of these Terms of Service or for any other reason deemed necessary.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="bg-base-100 rounded-md shadow-md p-6 md:p-8 border border-base-300" data-aos="fade-up">
            <div className="flex items-center gap-3 mb-6">
              <FaArrowRight className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-base-content">
                Changes to Terms
              </h2>
            </div>
            <p className="text-base-content/80 text-sm leading-relaxed">
              We may update these Terms of Service from time to time. Continued use of Edu Sync after changes constitutes acceptance of the new terms.
            </p>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-md p-6 md:p-8 border border-primary/20 text-center" data-aos="zoom-in">
            <h2 className="text-2xl font-semibold text-base-content mb-4">
              Questions About These Terms?
            </h2>
            <p className="text-base-content/80 mb-6 max-w-2xl mx-auto">
              If you have any questions about these Terms of Service, please contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant='primary'>
                <a href="mailto:support@edusync.com" className="inline-flex items-center gap-2">
                  <FaHandshake />
                  Email Support
                </a>
              </Button>
              <Button variant='secondary'>
                <Link to='/contact-us' className="inline-flex items-center gap-2">
                  <FaArrowRight />
                  Contact Us
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
        </div>
    );
};

export default TermsOfService;