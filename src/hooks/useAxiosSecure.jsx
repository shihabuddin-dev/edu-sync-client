import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

// making data url in central
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosSecure = () => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate()

  // interceptor request
  axiosInstance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
    return config;
  });

  // interceptor response
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const status = error.status;
      // Only auto-logout on 401 (authentication errors)
      if (error.response?.status === 401) {
        signOutUser()
          .then(() => console.log("sign out user for status code 401"))
          .catch((error) => console.log(error));
      }
      else if (status === 403) {
        navigate('/forbidden')
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxiosSecure;
