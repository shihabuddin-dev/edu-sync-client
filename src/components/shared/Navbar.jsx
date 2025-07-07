import { NavLink, Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import {
  FaBars,
  FaClipboardList,
  FaHome,
  FaParachuteBox,
  FaRegSave,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import Button from "../ui/Button";
import Swal from "sweetalert2";
import { MdLibraryAdd } from "react-icons/md";
import ThemeToggle from "../ui/ThemeToggle";
import userLogo from "../../assets/user-logo.png";
import { FaUsersViewfinder } from "react-icons/fa6";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, signOutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const toggleMenu = () => setIsOpen(!isOpen);

  // logout user
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
        })
          .then(() => {})
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
    "hover:text-primary text-base-content flex items-center gap-1";

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
    <nav className="bg-base-200 shadow-sm border-b-1 border-base-300 fixed top-0 left-0 right-0 z-50 w-full">
      <div className="max-w-7xl mx-auto py-2 px-4 md:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <FaParachuteBox className="w-8 h-8 text-primary" />
          <span className="text-2xl -ml-1 font-bold text-primary">
            Edu Sync
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex gap-5 font-semibold text-[#1a1a1a]">
          <li>
            <NavLink to="/" className={linksClass}>
              <FaHome />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/find-job" className={linksClass}>
              <FaUsersViewfinder />
              Find Job
            </NavLink>
          </li>
          <li>
            <NavLink to="/recruiters" className={linksClass}>
              <MdLibraryAdd />
              Recruiters
            </NavLink>
          </li>
          <li>
            <NavLink to="/my-recipes" className={linksClass}>
              <FaClipboardList />
              My Job
            </NavLink>
          </li>
          {user && (
            <li>
              <NavLink to="/wishlist" className={linksClass}>
                <FaRegSave />
                Wishlist
              </NavLink>
            </li>
          )}
        </ul>

        {/* Login / Avatar */}
        <div className="hidden space-x-2 lg:flex items-center">
          {user ? (
            <div
              className="relative cursor-pointer z-10"
              onClick={() => setShowDropdown(!showDropdown)}
              ref={dropdownRef}
            >
              <img
                src={user?.photoURL ? user?.photoURL : userLogo}
                alt="profile"
                title={user?.displayName}
                className="w-9 h-9 rounded-full border border-secondary"
              />
              <div
                className={`absolute right-0 mt-2 w-40 bg-base-100 border border-primary rounded-md shadow-lg transition-opacity duration-200 ${
                  showDropdown ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <p className="px-4 py-2 text-sm font-medium text-primary">
                  {user?.displayName}
                </p>
                <hr className="text-primary" />
                 <Link to="/my-profile">
                  <p className="px-4 py-2 text-sm font-medium "> My Profile</p>
                </Link>
                <hr className=" border-dashed" />
                <button
                  onClick={handleLogOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-primary w-full text-left cursor-pointer"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
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
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed left-0 right-0 top-[64px] z-40 transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-8 pointer-events-none"
        }`}
        style={{ minHeight: isOpen ? "calc(100vh - 72px)" : 0 }}
        aria-hidden={!isOpen}
      >
        <div className="px-4 pt-2 pb-4 bg-base-100 border-b border-base-300 shadow-lg rounded-b-xl">
          <ul className="flex flex-col gap-4 font-semibold text-[#1a1a1a]">
            <li>
              <NavLink to="/" onClick={toggleMenu} className={linksClass}>
                <FaHome />
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/find-job"
                onClick={toggleMenu}
                className={linksClass}
              >
                <FaUsersViewfinder />
                Find Job
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/recruiters"
                onClick={toggleMenu}
                className={linksClass}
              >
                <MdLibraryAdd />
                Recruiters
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/my-recipes"
                onClick={toggleMenu}
                className={linksClass}
              >
                <FaClipboardList />
                My Job
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wishlist"
                onClick={toggleMenu}
                className={linksClass}
              >
                <FaRegSave />
                Wishlist
              </NavLink>
            </li>
            <li className="space-x-2">
              {user ? (
                <div className="flex gap-4 items-center">
                  <img
                    src={user?.photoURL ? user?.photoURL : ""}
                    alt="profile"
                    className="w-9 h-9 rounded-full border border-secondary"
                  />
                  <div>
                    <p className="text-sm text-primary font-medium">
                      {user?.displayName}
                    </p>
                    <button
                      onClick={handleLogOut}
                      className="flex items-center gap-2 text-sm text-primary w-full"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/signin" onClick={toggleMenu}>
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link to="/signup" onClick={toggleMenu}>
                    <Button>Sign Up</Button>
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
