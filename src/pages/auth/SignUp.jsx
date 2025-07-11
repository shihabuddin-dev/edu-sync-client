import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import Button from "../../components/ui/Button";
import useAuth from "../../hooks/useAuth";
import Social from "./Social";
import { useState, useEffect } from "react";
import Spinner from "../../components/ui/Spinner";
import { GiArchiveRegister } from "react-icons/gi";
import signUp from "../../assets/lotti/education.json";
import Lottie from "lottie-react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaUpload, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import { uploadImageToImgBB } from "../../utils/uploadImageToImgBB";
import { inputBase } from "../../utils/inputBase";

// const inputBase =
//   "w-full border-b-2 border-base-content/30 px-4 py-3 pl-10 rounded-none focus:outline-none focus:ring-0 focus:border-secondary transition duration-300 bg-transparent text-base-content placeholder:text-base-content/50";


const SignUp = () => {
  const { createUser, setUser, updateUser, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  // Add state for feedback
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const axiosInstance = useAxios()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormError("");
    if (file) {
      if (!file.type.startsWith("image/")) {
        setFormError("Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Image size should be less than 5MB.");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setValue("photo", null);
    setFormError("");
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const onSubmit = async (data) => {
    setFormError("");
    setFormSuccess("");
    if (!selectedImage) {
      setFormError("Please select a photo.");
      return;
    }
    if (!data.name) {
      setFormError("Please enter your name.");
      return;
    }
    if (!data.email) {
      setFormError("Please enter your email address.");
      return;
    }
    if (!data.password) {
      setFormError("Please enter your password.");
      return;
    }
    setUploading(true);
    try {
      const userCredential = await createUser(data.email, data.password);
      const currentUser = userCredential.user;
      const uploadResult = await uploadImageToImgBB(selectedImage);
      let photoURL = imagePreview;
      if (uploadResult.success) {
        photoURL = uploadResult.url;
      }
      await updateUser({ displayName: data.name, photoURL });
      setUser({ ...currentUser, displayName: data.name, photoURL });
      await axiosInstance.post("/users", {
        email: data.email,
        role: "student",
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      });
      setFormSuccess("Registration Successful!");
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your account has been created successfully.",
        showConfirmButton: false,
        timer: 1500
      });
      reset();
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      let errorMsg = error.message;
      if (error.code === "auth/email-already-in-use") {
        errorMsg = "This email is already registered. Please use a different email or sign in.";
      }
      setFormError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="px-4 flex gap-4 flex-col md:flex-row justify-center items-center max-w-5xl">
      <title>Sign Up | Edu Sync</title>
      <div className="flex-1">
        <Lottie animationData={signUp} className="w-full h-[200px] md:h-[500px]" />
      </div>
      <div className="flex-1 max-w-md p-6 md:p-8 bg-base-100 rounded-md shadow-md border border-base-content/10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex justify-center items-center gap-3 text-base-content">
          <GiArchiveRegister className="text-primary text-3xl" /> Sign Up
        </h2>
        {formError && <div className="mb-4 text-error text-center font-medium">{formError}</div>}
        {formSuccess && <div className="mb-4 text-success text-center font-medium">{formSuccess}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content">Name</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
              <input type="text" {...register("name", { required: true })} className={inputBase} placeholder="Enter your Name" />
            </div>
            {errors.name && <span className="text-error text-xs">Name is required</span>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content">Photo</label>
            <div className="relative">
              <FaUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
              <input type="file" accept="image/*" {...register("photo", { required: false })} onChange={handleImageChange} className="w-full border-b-2 border-base-content/30 px-4 py-3 pl-10 rounded-none focus:outline-none focus:ring-0 focus:border-secondary transition duration-300 bg-transparent text-base-content file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-content hover:file:bg-primary/80 file:cursor-pointer" />
            </div>
            {imagePreview && (
              <div className="mt-3 p-3 bg-base-200/50 rounded-md relative">
                <button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md z-10" title="Remove photo">
                  <FaTimes className="text-xs" />
                </button>
                <p className="text-xs text-base-content/70 mb-2">Preview:</p>
                <div className="flex justify-center">
                  <img src={imagePreview} alt="Preview" className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-2 border-primary/20" />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content">Email address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
              <input type="email" {...register("email", { required: true })} className={inputBase} placeholder="Enter your Email" />
            </div>
            {errors.email && <span className="text-error text-xs">Email is required</span>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                  validate: {
                    hasUpperLower: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) || "Must contain both lower and upper case letters",
                    hasNumberOrSymbol: (v) => /[0-9!@#$%^&*(),.?":{}|<>]/.test(v) || "Must contain a number or symbol",
                    notEmail: (v) => !watch("email") || !v.includes(watch("email")) || "Password should not contain your email address",
                  },
                })}
                className={inputBase}
                placeholder="Enter your password"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-base-content/70 hover:text-base-content transition-colors" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </span>
            </div>
            {errors.password && (
              <div className="text-error text-xs mt-1">
                {errors.password.message}
                {errors.password.type === "validate" &&
                  Object.values(errors.password.types || {}).map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                  ))}
              </div>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? (
              <div className="flex justify-center items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
        <Social />
        <p className="text-sm mt-4 text-base-content text-center">
          Already have an account?{" "}
          <Link to="/signIn" className="text-primary underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
