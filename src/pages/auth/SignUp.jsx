import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaUpload, FaTimes } from "react-icons/fa";
import Button from "../../components/ui/Button";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { GiArchiveRegister } from "react-icons/gi";
import Spinner from "../../components/ui/Spinner";
import signUp from "../../assets/lotti/education.json";
import Lottie from "lottie-react";
import useAuth from "../../hooks/useAuth";
import Social from "./Social";
import axios from "axios";

const inputBase =
  "w-full border-b-2 border-base-content/30 px-4 py-3 pl-10 rounded-none focus:outline-none focus:ring-0 focus:border-secondary transition duration-300 bg-transparent text-base-content placeholder:text-base-content/50";

// ImgBB API configuration
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "your_imgbb_api_key_here";
const IMGBB_API_URL = "https://api.imgbb.com/1/upload";

// Function to upload image to ImgBB using axios
const uploadImageToImgBB = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('key', IMGBB_API_KEY);

    const response = await axios.post(IMGBB_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = response.data;

    if (data.success) {
      return {
        success: true,
        url: data.data.url,
        deleteUrl: data.data.delete_url,
        id: data.data.id
      };
    } else {
      throw new Error(data.error?.message || 'Upload failed');
    }
  } catch (error) {
    console.error('ImgBB upload error:', error);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message
    };
  }
};

const SignUp = () => {
  const { createUser, setUser, updateUser, user } =
    useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate(location?.state || "/");
      }, 100);
    } else {
      setLoading(false);
    }
  }, [user, location, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: "error",
          title: "Please select an image file.",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Image size should be less than 5MB.",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validations = [
    {
      label: "contains at least 6 characters",
      isValid: password.length >= 6,
    },
    {
      label: "contains both lower (a-z) and upper case letters (A-Z)",
      isValid: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
    {
      label: "contains at least one number (0-9) or a symbol",
      isValid: /[0-9!@#$%^&*(),.?":{}|<>]/.test(password),
    },
    {
      label: "does not contain your email address",
      isValid: email && !password.includes(email),
    },
  ];

  // Sign up with email/password
  const handleSignUp = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const { name, email, password } = Object.fromEntries(
      formData.entries()
    );

    if (!name) {
      Swal.fire({
        icon: "error",
        title: "Please enter your name.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    if (!selectedImage) {
      Swal.fire({
        icon: "error",
        title: "Please select a photo.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Please enter your email address.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    if (!password) {
      Swal.fire({
        icon: "error",
        title: "Please enter your password.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const allValid = validations.every((rule) => rule.isValid);
    if (!allValid) {
      Swal.fire({
        icon: "error",
        title: "Password doesn't meet all requirements",
        showConfirmButton: false,
        timer: 1600,
      });
      return;
    }

    setUploading(true);

    try {
      // First, create the Firebase user
      const userCredential = await createUser(email, password);
      const currentUser = userCredential.user;

      // Show uploading image message
      Swal.fire({
        title: "Creating account...",
        text: "Uploading your profile image to ImgBB...",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Upload image to ImgBB
      const uploadResult = await uploadImageToImgBB(selectedImage);
      
      if (uploadResult.success) {
        // Update user profile with ImgBB URL
        await updateUser({ 
          displayName: name, 
          photoURL: uploadResult.url 
        });

        setUser({ 
          ...currentUser, 
          displayName: name, 
          photoURL: uploadResult.url 
        });

        // Success message
        Swal.fire({
          title: "Success!",
          text: "Your account has been created and image uploaded successfully!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });

        // Navigate to intended page
        navigate(location?.state ? location.state : "/");
        
        // Reset form
        form.reset();
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        // If ImgBB upload fails, use the preview URL as fallback
        console.warn('ImgBB upload failed, using preview URL:', uploadResult.error);
        
        await updateUser({ 
          displayName: name, 
          photoURL: imagePreview 
        });

        setUser({ 
          ...currentUser, 
          displayName: name, 
          photoURL: imagePreview 
        });

        Swal.fire({
          title: "Account Created!",
          text: "Your account was created successfully, but image upload failed. Using local preview.",
          icon: "warning",
          showConfirmButton: false,
          timer: 2000,
        });

        navigate(location?.state ? location.state : "/");
        form.reset();
        setSelectedImage(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      let errorMsg = error.message;
      if (error.code === "auth/email-already-in-use") {
        errorMsg = "This email is already registered. Please use a different email or sign in.";
      }
      
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMsg,
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="px-4 flex gap-4 flex-col md:flex-row justify-center items-center max-w-5xl">
      <title>Sign Up | Edu Sync</title>
      <div className="flex-1">
        <Lottie animationData={signUp} className="w-full h-[200px] md:h-[500px]"></Lottie>
      </div>{" "}
      <div className="flex-1 max-w-md p-6 md:p-8 bg-base-100 rounded-md shadow-md border border-base-content/10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex justify-center items-center gap-3 text-base-content">
          <GiArchiveRegister className="text-primary text-3xl" /> Sign Up
        </h2>
        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content">
              Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
              <input
                type="text"
                name="name"
                className={inputBase}
                placeholder="Enter your Name"
                // required removed to handle validation with SweetAlert
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-base-content">
              Photo
            </label>
            <div className="relative">
              <FaUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border-b-2 border-base-content/30 px-4 py-3 pl-10 rounded-none focus:outline-none focus:ring-0 focus:border-secondary transition duration-300 bg-transparent text-base-content file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-content hover:file:bg-primary/80 file:cursor-pointer"
              />
            </div>
            {imagePreview && (
              <div className="mt-3 p-3 bg-base-200/50 rounded-md relative">
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md z-10"
                  title="Remove photo"
                >
                  <FaTimes className="text-xs" />
                </button>
                <p className="text-xs text-base-content/70 mb-2">Preview:</p>
                <div className="flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-2 border-primary/20"
                  />
                </div>
              </div>
            )}
          </div>

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
                // required removed to handle validation with SweetAlert
              />
            </div>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                // required removed to handle validation with SweetAlert
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-base-content/70 hover:text-base-content transition-colors"
                onClick={togglePassword}
              >
                {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </span>
            </div>
          </div>

          {/* Password Validation List */}
          <div className="text-sm text-base-content bg-base-200/50 p-4 rounded-md">
            <p className="font-medium mb-3">Create a password that:</p>
            <ul className="space-y-2">
              {validations.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span
                    className={`w-5 h-5 flex items-center justify-center border rounded-sm mt-0.5 ${rule.isValid
                        ? "bg-green-500 text-white border-green-500"
                        : "border-base-300 text-red-500"
                      }`}
                  >
                    {rule.isValid ? "✓" : "×"}
                  </span>
                  <span className="text-base-content/80">{rule.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={uploading}
          >
            {uploading ? (
              <div className="flex items-center gap-2">
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
          <Link to="/signIn" className="text-primary underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
