import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaUsers, FaBook, FaChalkboardTeacher, FaBullhorn, FaLayerGroup, FaGraduationCap, FaRegCalendarPlus, FaListAlt, FaCloudUploadAlt, FaFolderOpen } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import useUserRole from "../hooks/useUserRole";
import Spinner from "../components/ui/Spinner";
import Logo from "../components/shared/Logo";
import Button from "../components/ui/Button";
import { MdNoteAdd, MdNoteAlt } from "react-icons/md";

const adminLinks = [
  {
    to: "/dashboard/admin/users",
    label: "All Users",
    icon: <FaUsers />,
  },
  {
    to: "/dashboard/admin/sessions",
    label: "All Study Sessions",
    icon: <FaBook />,
  },
  {
    to: "/dashboard/admin/materials",
    label: "All Materials",
    icon: <FaLayerGroup />,
  },
  {
    to: "/dashboard/admin/announcements",
    label: "Announcements",
    icon: <FaBullhorn />,
  },
  {
    to: "/dashboard/admin/students",
    label: "Students",
    icon: <FaUsers />,
  },
];

const tutorLinks = [
  {
    to: "/dashboard/tutor/create-session",
    label: "Create Study Session",
    icon: <FaRegCalendarPlus />
  },
  {
    to: "/dashboard/tutor/sessions",
    label: "My All Study Sessions",
    icon: <FaListAlt />
  },
  {
    to: "/dashboard/tutor/upload-materials",
    label: "Upload Materials",
    icon: <FaCloudUploadAlt />
  },
  {
    to: "/dashboard/tutor/materials",
    label: "View All Materials",
    icon: <FaFolderOpen />
  },
  {
    to: "/dashboard/tutor/students",
    label: "Students",
    icon: <FaUsers />,
  },
];

const studentLinks = [
  {
    to: "/dashboard/student/my-bookings",
    label: "Booked Sessions",
    icon: <FaGraduationCap />,
  },
  {
    to: "/dashboard/student/create-note",
    label: "Create Note",
    icon: <MdNoteAdd />,
  },
  {
    to: "/dashboard/student/manage-notes",
    label: "Manage Notes",
    icon: <MdNoteAlt />,
  },
  {
    to: "/dashboard/student/study-materials",
    label: "Study Materials",
    icon: <FaChalkboardTeacher />,
  },
  {
    to: "/dashboard/student/all-student",
    label: "All Student",
    icon: <FaUsers />,
  },
];

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();
  const { user, signOutUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine links based on role
  let navLinks = [];
  if (role === "admin") navLinks = adminLinks;
  else if (role === "tutor") navLinks = tutorLinks;
  else if (role === "student") navLinks = studentLinks;



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

  if (roleLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex min-h-screen bg-base-200 max-w-7xl mx-auto relative">
      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 w-64 bg-base-100 shadow-md transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-200 ease-in-out md:translate-x-0 md:relative md:w-64`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <Logo />
          <button className="md:hidden text-2xl" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <nav className="mt-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-1.5 font-medium transition-colors ${isActive ? "bg-primary text-white" : "text-base-content hover:bg-primary/10"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
        <Button
          className="btn btn-sm flex mx-auto mt-4 lg:hidden items-center gap-2"
          onClick={handleLogOut}
        >
          <FaSignOutAlt /> Sign Out
        </Button>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <header className="max-w-5xl mx-auto fixed top-0 left-0 md:left-64 right-0 z-10 bg-base-100 px-4 py-3 shadow flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-2xl" onClick={() => setSidebarOpen(true)}>
              <FaBars />
            </button>
            <span className="text-2xl font-semibold text-primary">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User"
                  title={user?.displayName}
                  className="w-9 h-9 rounded-full object-cover border border-primary"
                />
              ) : (
                <FaUserCircle className="w-8 h-8 text-base-content" />
              )}
              <span className="font-medium hidden lg:inline">
                {user?.displayName || user?.name}
              </span>
              <span className="badge badge-outline rounded-md border-primary hidden lg:inline">
                {role}
              </span>
            </div>
            <Button
              className="btn btn-sm lg:flex items-center gap-2 hidden"
              onClick={handleLogOut}
            >
              <FaSignOutAlt /> Sign Out
            </Button>
          </div>
        </header>

        {/* Main Scrollable Content */}
        <main className="mt-[64px] p-4 h-[calc(100vh-64px)] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );

};

export default DashboardLayout;