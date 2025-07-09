import { NavLink, Link, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import {
  MdSchool,
  MdMenuBook,
  MdInfo,
  MdBarChart,
  MdDashboard,
  MdLogout,
  MdMenu,
  MdClose,
  MdContactSupport
} from "react-icons/md";
import Button from "../ui/Button";
import Swal from "sweetalert2";
import ThemeToggle from "../ui/ThemeToggle";
import userLogo from "../../assets/user-logo.png";

import useAuth from "../../hooks/useAuth";
import { FaUser } from "react-icons/fa";
import Logo from "./Logo";
// import Logo from "./Logo";

const Navbar = () => {
  const { user, signOutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const toggleMenu = () => setIsOpen(!isOpen);
  const navigate = useNavigate()

  //Sign Out user
  const handleLogOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Sign out!",
    }).then((result) => {
      if (result.isConfirmed) {
        signOutUser();
        Swal.fire({
          title: "Sign out!",
          text: "You have been Sign out.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        })
          .then(() => { })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              title: "Error!",
              text: "Sign failed.",
              icon: "error",
            });
          });
      }
    });
  };

  const linksClass =
    "hover:text-primary text-base-content/85 flex items-center gap-1";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <nav className="bg-base-200 shadow-xs border-b-1 border-base-300 fixed top-0 left-0 right-0 z-50 w-full">
      <div className="max-w-7xl mx-auto py-2 md:py-3 px-4 md:px-6 lg:px-8 flex justify-between items-center">

        <Logo />
        {/* Desktop Nav */}
        <ul className="hidden lg:flex gap-5 font-semibold text-[#1a1a1a]">
          <li>
            <NavLink to="/tutors" className={linksClass}>
              <MdSchool />
              Tutors
            </NavLink>
          </li>
          <li>
            <NavLink to="/study-sessions" className={linksClass}>
              <MdMenuBook />
              Study Sessions
            </NavLink>
          </li>
          <li>
            <NavLink to="/statistic" className={linksClass}>
              <MdBarChart />
              Statistic
            </NavLink>
          </li>
          <li>
            <NavLink to="/about-us" className={linksClass}>
              <MdInfo />
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/support" className={linksClass}>
              <MdContactSupport />
              Support
            </NavLink>
          </li>
          {/* {user && <li>
            <NavLink to="/dashboard" className={linksClass}>
              <MdDashboard /> Dashboard
            </NavLink>
          </li>} */}
        </ul>

        {/* Sign In / Avatar */}
        <div className="hidden space-x-2 lg:flex items-center">
          {user ? (
            <div className="relative cursor-pointer z-10 " onClick={toggleMenu} ref={dropdownRef}>
              <img
                src={user?.photoURL ? user?.photoURL : userLogo}
                alt="profile"
                title={user?.displayName}
                className="w-9 h-9 rounded-full border border-secondary"
                onClick={() => setShowDropdown(!showDropdown)}
              />
              <div
                className={`absolute right-0 mt-2 w-40 bg-base-200 rounded-md shadow-md transition-opacity duration-200 ${showDropdown ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
              >
                <p className="px-4 py-2 text-sm font-medium">
                  Hi, {user?.displayName}
                </p>
                <p>
                  <p>
                    <NavLink
                      to='/my-profile'
                      className="px-4 py-2 text-sm font-medium hover:text-primary flex items-center gap-1"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaUser />
                      My Profile
                    </NavLink>
                  </p>
                  <NavLink
                    to='/dashboard'
                    className="px-4 py-2 text-sm font-medium hover:text-primary flex items-center gap-1"
                    onClick={() => setShowDropdown(false)}
                  >
                    <MdDashboard /> Dashboard
                  </NavLink>
                </p>

                <button
                  onClick={handleLogOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-primary w-full text-left cursor-pointer"
                >
                  <MdLogout size={20} className="text-primary" />Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="outline" className="btn btn-sm">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="btn btn-sm">Sign Up</Button>
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <MdClose size={24} className="text-primary" /> : <MdMenu size={24} className="text-primary" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed left-0 right-0 top-[48px] z-40 transition-all duration-300 ${isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-8 pointer-events-none"
          }`}
        style={{ minHeight: isOpen ? "calc(100vh - 72px)" : 0 }}
        aria-hidden={!isOpen}
      >
        <div className="px-4 pt-2 pb-4 bg-base-100 border-b border-base-300 shadow-lg rounded-b-md">
          <ul className="flex flex-col gap-4 font-semibold text-[#1a1a1a]">
            <li>
              <NavLink to="/tutors" onClick={toggleMenu} className={linksClass}>
                <MdSchool />
                Tutors
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/study-sessions"
                onClick={toggleMenu}
                className={linksClass}
              >
                <MdMenuBook />
                Study Sessions
              </NavLink>
            </li>
            <li>
              <NavLink to="/statistic" onClick={toggleMenu} className={linksClass}>
                <MdBarChart />
                Statistic
              </NavLink>
            </li>
            <li>
              <NavLink to="/about-us" onClick={toggleMenu} className={linksClass}>
                <MdInfo />
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/support" onClick={toggleMenu} className={linksClass}>
                <MdContactSupport />
                Support
              </NavLink>
            </li>
            {
              user && <li> <NavLink to="/dashboard" onClick={toggleMenu} className={linksClass}>
                <MdDashboard />Dashboard
              </NavLink></li>
            }
            <li className="space-x-2">
              {user ? (
                <div className="flex gap-4 items-center" onClick={toggleMenu}>
                  <img
                    onClick={() => navigate('/my-profile')}
                    src={user?.photoURL ? user?.photoURL : userLogo}
                    alt="profile"
                    title="click and go Your profile"
                    className="w-9 h-9 rounded-full border border-secondary"
                  />
                  <div>
                    <p className=" text-primary font-medium">
                      Hi, {user?.displayName}
                    </p>
                    <button
                      onClick={handleLogOut}
                      className="flex items-center gap-2 text-sm text-primary w-full mt-2"
                    >
                      <MdLogout size={20} className="text-primary" />Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/signin" onClick={toggleMenu}>
                    <Button variant="outline" className="btn btn-sm">Sign In</Button>
                  </Link>
                  <Link to="/signup" onClick={toggleMenu}>
                    <Button className="btn btn-sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
