import React from 'react';
import { Link } from 'react-router';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaUsers,
  FaBookOpen,
  FaChartLine,
  FaHeart
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-200 border-t border-base-300">
      {/* Main Footer Content */}
      <div className="mx-auto py-12 px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FaGraduationCap className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Edu Sync</span>
            </div>
            <p className="text-base-content/80 leading-relaxed">
              Empowering students and tutors to connect, collaborate, and excel together.
              Join our community of learners and educators.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300">
                <FaFacebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300">
                <FaTwitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300">
                <FaInstagram size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300">
                <FaLinkedin size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300">
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-base-content flex items-center gap-2">
              <FaBookOpen className="text-primary" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/tutors" className="text-base-content/70 hover:text-primary transition-colors duration-300 flex items-center gap-2 rounded-md">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link to="/study-sessions" className="text-base-content/70 hover:text-primary transition-colors duration-300 flex items-center gap-2 rounded-md">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  Study Sessions
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-base-content/70 hover:text-primary transition-colors duration-300 flex items-center gap-2 rounded-md">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-base-content/70 hover:text-primary transition-colors duration-300 flex items-center gap-2 rounded-md">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/announcements" className="text-base-content/70 hover:text-primary transition-colors duration-300 flex items-center gap-2 rounded-md">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  Announcements
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-base-content flex items-center gap-2">
              <FaUsers className="text-primary" />
              Our Services
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/dashboard" className="text-base-content/70 hover:text-primary transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-base-content/70 hover:text-primary transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  Tutor Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-base-content/70 hover:text-primary transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  Admin Panel
                </Link>
              </li>
              <li>
                <Link to="/study-materials" className="text-base-content/70 hover:text-primary transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  Study Materials
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-base-content/70 hover:text-primary transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  Reviews & Ratings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-base-content flex items-center gap-2">
              <FaChartLine className="text-primary" />
              Contact Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-base-content/70">
                <FaPhone className="text-primary" />
                <span>+88 01740 520249</span>
              </div>
              <div className="flex items-center gap-3 text-base-content/70">
                <FaEnvelope className="text-primary" />
                <span>info@edusync.com</span>
              </div>
              <div className="flex items-center gap-3 text-base-content/70">
                <FaMapMarkerAlt className="text-primary" />
                <span>5800, Bogura City, Bangladesh</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-base-content mb-3">Stay Updated</h4>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-2 py-2 sm:px-4 border border-base-300 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:border-primary bg-base-100 text-sm"
                />
                <button className="px-2 py-2 bg-primary text-white rounded-md sm:rounded-l-none sm:rounded-r-md hover:bg-primary/90 transition-colors duration-300 text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-base-300 bg-base-300/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-base-content/70 text-sm">
              © {currentYear} Edu Sync. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-base-content/70 hover:text-primary transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-base-content/70 hover:text-primary transition-colors duration-300">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-base-content/70 hover:text-primary transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
            <div className="flex items-center gap-2 text-base-content/70 text-sm">
              <span>Made with</span>
              <FaHeart className="text-red-500" />
              <span>for education</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;