import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaUsers, FaBook, FaChalkboardTeacher, FaBullhorn } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import useUserRole from "../hooks/useUserRole";
import Spinner from "../components/ui/Spinner";

const adminLinks = [
  { to: "/dashboard/admin/users", label: "Manage Users", icon: <FaUsers /> },
  { to: "/dashboard/admin/sessions", label: "Manage Sessions", icon: <FaBook /> },
  { to: "/dashboard/admin/materials", label: "Manage Materials", icon: <FaChalkboardTeacher /> },
  { to: "/dashboard/admin/announcements", label: "Announcements", icon: <FaBullhorn /> },
];

const tutorLinks = [
  { to: "/dashboard/tutor/create-session", label: "Create Session", icon: <FaBook /> },
  { to: "/dashboard/tutor/sessions", label: "My Sessions", icon: <FaBook /> },
  { to: "/dashboard/tutor/materials", label: "My Materials", icon: <FaChalkboardTeacher /> },
];

const studentLinks = [
  { to: "/dashboard/student/booked-sessions", label: "Booked Sessions", icon: <FaBook /> },
  { to: "/dashboard/student/create-note", label: "Create Note", icon: <FaBook /> },
  { to: "/dashboard/student/manage-notes", label: "Manage Notes", icon: <FaBook /> },
  { to: "/dashboard/student/study-materials", label: "Study Materials", icon: <FaChalkboardTeacher /> },
];

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();
  const { user, signOutUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Determine links based on role
  let navLinks = [];
  if (role === "admin") navLinks = adminLinks;
  else if (role === "tutor") navLinks = tutorLinks;
  else if (role === "student") navLinks = studentLinks;

  const handleLogout = async () => {
    await signOutUser();
    Swal.fire({
      icon: "success",
      title: "Logged out!",
      showConfirmButton: false,
      timer: 1200,
    });
    navigate("/signin");
  };

  if (roleLoading) {
    return (
     <Spinner/>
    );
  }

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 w-64 bg-base-100 shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out md:relative md:translate-x-0 md:w-64`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <Link to="/" className="text-xl font-bold text-primary">
            EduSync
          </Link>
          <button
            className="md:hidden text-2xl"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        <nav className="mt-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-base font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-base-content hover:bg-primary/10"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-base-100 px-4 py-3 shadow md:ml-64">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden text-2xl"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars />
            </button>
            <span className="text-lg font-semibold text-primary">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover border"
                />
              ) : (
                <FaUserCircle className="w-8 h-8 text-base-content" />
              )}
              <span className="font-medium">{user?.name}</span>
              <span className="badge badge-outline">{role}</span>
            </div>
            <button
              className="btn btn-sm btn-error flex items-center gap-2"
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 p-4 md:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;