import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import Button from "../../components/ui/Button";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { MdLogin } from "react-icons/md";
import Spinner from "../../components/ui/Spinner";
import Lottie from "lottie-react";
import signIn from "../../assets/lotti/education.json";
import useAuth from "../../hooks/useAuth";
import Social from "./Social";
import { useForm } from "react-hook-form";
import { inputBase } from "../../utils/inputBase";


const SignIn = () => {
  const { signInUser, setUser, user } = useAuth()
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);
  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate(location?.state || "/");
      }, 100);
    } else {
      setLoading(false);
    }
  }, [user, location, navigate]);

  const onSubmit = async (data) => {
    clearErrors();
    try {
      const userCredential = await signInUser(data.email, data.password);
      setUser(userCredential.user);
      Swal.fire({
        icon: "success",
        title: "Sign In Success",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate(location?.state || "/");
    } catch (error) {
      setError("api", { message: error.code || "Login failed" });
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.code,
      });
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
  <div className="px-4 flex gap-4 flex-col md:flex-row justify-center items-center max-w-5xl mx-auto">
      <title>Sign In | Edu Sync</title>
      <div className="flex-1">
        <Lottie
          animationData={signIn}
          className="w-full h-[200px] md:h-[400px]"
        />
      </div>{" "}
      <div className="flex-1 max-w-md p-6 md:p-8 bg-base-100 rounded-md shadow-md border border-base-content/10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex justify-center items-center gap-3 text-base-content">
          <MdLogin className="text-primary text-3xl" />
          Sign in
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content">
              Email address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
              <input
                type="email"
                name="email"
                className={inputBase}
                placeholder="you@example.com"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && <span className="text-error text-xs">{errors.email.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={inputBase}
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-base-content/70 hover:text-base-content transition-colors"
                onClick={togglePassword}
              >
                {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </span>
            </div>
            {errors.password && <span className="text-error text-xs">{errors.password.message}</span>}
            <div className="flex justify-end mt-2">
              <Link
                to="/reset-password"
                className="text-xs text-primary hover:text-primary/80 underline transition-colors"
              >
                Forget Password?
              </Link>
            </div>
          </div>
          {errors.api && <div className="text-error text-xs text-center mb-2">{errors.api.message}</div>}
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
        <Social />
        <p className="text-sm mt-4 text-base-content text-center">
          Don't have an account?{" "}
          <Link to="/signUp" className="text-primary underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
