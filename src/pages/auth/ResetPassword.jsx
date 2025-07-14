import { Link } from "react-router";
import Button from "../../components/ui/Button";
import Swal from "sweetalert2";
import { MdLockReset } from "react-icons/md";
import { FaEnvelope } from "react-icons/fa";
import resetAnimation from "../../assets/lotti/reset-password.json";
import Lottie from "lottie-react";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { inputBase } from "../../utils/inputBase";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();

  const onSubmit = (data) => {
    clearErrors();
    const email = data.email.trim();
    if (!email) {
      setError("email", { message: "Please enter your email address." });
      return;
    }
    resetPassword(email)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Password reset email sent! Redirecting to Gmail...",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          window.location.href = "https://mail.google.com";
        }, 1500);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (
          errorCode === "auth/user-not-found" ||
          errorCode === "auth/invalid-email"
        ) {
          setError("email", { message: "This email address is not registered or is invalid." });
          Swal.fire({
            icon: "error",
            title: "This email address is not registered or is invalid.",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          setError("email", { message: "Failed to send reset email." });
          Swal.fire({
            icon: "error",
            title: "Failed to send reset email.",
            showConfirmButton: false,
            timer: 1500,
          });
        }
        console.error("Reset Password Error:", errorCode, errorMessage);
      });
  };

  return (
    <div className="px-4 flex gap-4 flex-col md:flex-row justify-center items-center max-w-5xl mx-auto">
      <title>Reset Password | Edu Sync</title>
      <div className="flex-1">
        <Lottie
          animationData={resetAnimation}
          className="pl-6 sm:pl-0 w-full h-[200px] md:h-[300px]"
        ></Lottie>
      </div>
      <div className="xl:mr-16 flex-1 max-w-md p-6 md:p-8 bg-base-100 rounded-md shadow-md border border-base-content/10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex justify-center items-center gap-3 text-base-content">
          <MdLockReset className="text-primary text-3xl" />
          Reset Password
        </h2>
        <p className="text-center text-sm mb-6 text-base-content/70">
          Enter your email address below and we'll send you a link to reset your
          password.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-base-content">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter Your Email"
                className={inputBase}
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && <span className="text-error text-xs">{errors.email.message}</span>}
          </div>

          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>

          <div className="text-center text-sm text-base-content/70">
            Remember your password?{" "}
            <Link to="/signin" className="text-primary hover:text-primary/80 underline font-medium transition-colors">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
