import { Link } from "react-router";
import Button from "../../components/ui/Button";
import Swal from "sweetalert2";
import { MdLockReset } from "react-icons/md";
import resetAnimation from "../../assets/lotti/reset-password.json";
import Lottie from "lottie-react";
import useAuth from "../../hooks/useAuth";

const ResetPassword = () => {
  const { resetPassword } = useAuth();

  const handleResetPassword = (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();

    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Please enter your email address.",
        showConfirmButton: false,
        timer: 1500,
      });
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
          Swal.fire({
            icon: "error",
            title: "This email address is not registered or is invalid.",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
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
    <div className="flex gap-4 flex-col md:flex-row justify-center items-center max-w-5xl">
      <title>Reset Password || Career Code</title>
      <div className="flex-1">
        <Lottie
          animationData={resetAnimation}
          className="w-full h-[200px] md:h-[300px]"
        ></Lottie>
      </div>
      <div className="flex-1 bg-base-100 rounded p-6 sm:p-8 md:p-10 w-full max-w-md border-2 border-secondary">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex justify-center items-center gap-3">
          <MdLockReset className="text-primary" />
          Reset Password
        </h2>
        <p className="text-center text-sm mb-6">
          Enter your email address below and we'll send you a link to reset your
          password.
        </p>
        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter Your Email"
              className="w-full border-2 border-base-content/20 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition duration-200 bg-base-100 text-base-content"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-2 py-2">
            Send Reset Link
          </Button>

          {/* Redirect to Login */}
          <div className="mt-2 text-center text-sm">
            Remember your password?{" "}
            <Link to="/signin" className="text-primary underline font-medium">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
