import axios from "axios";
import useAuth from "./useAuth";

// making data url in central
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosSecure = () => {
  const { user, signOutUser } = useAuth();

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
      if (error.status === 401 || error.status === 403) {
        signOutUser()
          .then(() => console.log("sign out user for status code 401"))
          .catch((error) => console.log(error));
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxiosSecure;
