import { createBrowserRouter } from "react-router";
import Root from "../layout/Root";
import Home from "../pages/home/Home";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import ResetPassword from "../pages/auth/ResetPassword";
import MyProfile from "../pages/myprofile/MyProfile";
import PrivateRoutes from "./PrivateRoutes";
import AdminRoutes from "./AdminRoutes";
import TutorRoutes from "./TutorRoutes";
import StudentRoutes from "./StudentRoutes";
import PrivacyPolicy from "../pages/PageOfStatic/PrivacyPolicy";
import TermsOfService from "../pages/PageOfStatic/TermsOfService";
import CookiePolicy from "../pages/PageOfStatic/CookiePolicy";
import AboutUs from "../pages/PageOfStatic/AboutUs";
import Support from "../pages/PageOfStatic/Support";
import DashboardLayout from "../layout/DashboardLayout";
import CreateNote from "../pages/dashboard/student/CreateNote";
import ManageNotes from "../pages/dashboard/student/ManageNotes";
import MyBookings from "../pages/dashboard/student/MyBookings";
import NotFound from "../pages/notFound/NotFound";
import CreateStudySession from "../pages/dashboard/tutor/CreateStudySession";
import MyAllStudySessions from "../pages/dashboard/tutor/MyAllStudySessions";
import UpdateSession from "../pages/dashboard/tutor/UpdateSession";
import UploadMaterials from "../pages/dashboard/tutor/UploadMaterials";
import MyApprovedSessions from "../pages/dashboard/tutor/MyApprovedSessions";
import ViewAllMaterials from "../pages/dashboard/tutor/ViewAllMaterials";
import AllUsers from "../pages/dashboard/admin/AllUsers";
import AllStudySessionsOfTutors from "../pages/dashboard/admin/AllStudySessionsOfTutors";
import AllMaterials from "../pages/dashboard/admin/AllMaterials";
import Announcements from "../pages/dashboard/admin/Announcements";
import Forbidden from "../pages/forbidden/Forbidden";
import UserInfo from '../pages/dashboard/admin/UserInfo';
import AnnouncementsList from "../pages/announcements/AnnouncementsList";
import StudySessions from "../pages/studySessions/StudySessions";
import DetailsStudySession from "../pages/studySessions/DetailsStudySession";
import Payment from "../pages/payment/Payment";
import BookingDetails from "../pages/dashboard/student/BookingDetails";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      { path: 'forbidden', Component: Forbidden },
      { path: "signin", Component: SignIn },
      { path: "signup", Component: SignUp },
      { path: "reset-password", Component: ResetPassword },
      // { path: '/blogs', Component: Blogs },

      // static page 
      { path: "about-us", Component: AboutUs },
      { path: "support", Component: Support },
      { path: "privacy", Component: PrivacyPolicy },
      { path: "terms", Component: TermsOfService },
      { path: "cookies", Component: CookiePolicy },
      { path: "announcements", Component: AnnouncementsList },
      { path: "study-sessions", Component: StudySessions },
      { path: "study-sessions/:id", Component: DetailsStudySession },
      // private routes
      {
        path: "my-profile",
        element: (
          <PrivateRoutes>
            <MyProfile />
          </PrivateRoutes>
        ),
      },
      {
        path: "payment/:id",
        element: (
          <PrivateRoutes>
            <Payment />
          </PrivateRoutes>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoutes><DashboardLayout /></PrivateRoutes>,
    children: [

      // student routes
      {
        path: 'student/create-note',
        element: <StudentRoutes><CreateNote /></StudentRoutes>
      },
      {
        path: 'student/manage-notes',
        element: <StudentRoutes><ManageNotes /></StudentRoutes>
      },
      {
        path: 'student/my-bookings',
        element: <StudentRoutes><MyBookings /></StudentRoutes>
      },
      {
        path: 'student/my-bookings/:id',
        element: <StudentRoutes><BookingDetails /></StudentRoutes>
      },

      // tutor routes
      {
        path: 'tutor/create-session',
        element: <TutorRoutes><CreateStudySession /></TutorRoutes>
      },
      {
        path: 'tutor/sessions',
        element: <TutorRoutes><MyAllStudySessions /></TutorRoutes>
      },
      {
        path: 'tutor/update-session/:id',
        element: <TutorRoutes><UpdateSession /></TutorRoutes>
      },
      {
        path: 'tutor/upload-materials',
        element: <TutorRoutes><MyApprovedSessions /></TutorRoutes>
      },
      {
        path: 'tutor/upload-materials/:sessionId',
        element: <TutorRoutes><UploadMaterials /></TutorRoutes>
      },
      {
        path: 'tutor/materials',
        element: <TutorRoutes><ViewAllMaterials /></TutorRoutes>
      },

      // admin Routes
      {
        path: 'admin/users',
        element: <AdminRoutes><AllUsers /></AdminRoutes>
      },
      {
        path: 'admin/users/:id',
        element: <AdminRoutes><UserInfo /></AdminRoutes>
      },
      {
        path: 'admin/sessions',
        element: <AdminRoutes><AllStudySessionsOfTutors /></AdminRoutes>
      },
      {
        path: 'admin/sessions/:id',
        element: <AdminRoutes><UpdateSession /></AdminRoutes>
      },
      {
        path: 'admin/materials',
        element: <AdminRoutes><AllMaterials /></AdminRoutes>
      },
      {
        path: 'admin/announcements',
        element: <AdminRoutes><Announcements /></AdminRoutes>
      },
    ]
  },
  {
    path: '*',
    Component: NotFound
  }
]);

export default router;
