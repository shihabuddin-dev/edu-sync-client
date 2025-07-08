import { createBrowserRouter } from "react-router";
import Root from "../layout/Root";
import Home from "../pages/home/Home";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import ResetPassword from "../pages/auth/ResetPassword";
import MyProfile from "../pages/myprofile/MyProfile";
import PrivateRoutes from "./PrivateRoutes";
import PrivacyPolicy from "../pages/PageOfStatic/PrivacyPolicy";
import TermsOfService from "../pages/PageOfStatic/TermsOfService";
import CookiePolicy from "../pages/PageOfStatic/CookiePolicy";
import AboutUs from "../pages/PageOfStatic/AboutUs";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      { path: "/signin", Component: SignIn },
      { path: "/signup", Component: SignUp },
      { path: "/reset-password", Component: ResetPassword },
      // { path: '/blogs', Component: Blogs },

      // static page 
      { path: "/about-us", Component: AboutUs },
      { path: "/privacy", Component: PrivacyPolicy },
      { path: "/terms", Component: TermsOfService },
      { path: "/cookies", Component: CookiePolicy },


      //  loader: () => fetch(`${import.meta.env.VITE_API_URL}/recipes`),

      // private routes
      {
        path: "/my-profile",
        element: (
          <PrivateRoutes>
            <MyProfile />
          </PrivateRoutes>
        ),
      },
    ],
  },
]);

export default router;
