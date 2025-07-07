import { Navigate, useLocation } from "react-router";
import Spinner from "../components/ui/Spinner";
import useAuth from "../hooks/useAuth";

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // when loading true show spinner
  if (loading) {
    return <Spinner />;
  }
  // if user don't found login so sent to login pages to login
  if (!user) {
    return <Navigate state={location?.pathname} to="/signin" />;
  }

  return children;
};

export default PrivateRoutes;
