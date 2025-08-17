import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Button from "../../components/ui/Button";
import useAuth from "../../hooks/useAuth";
import { FaEnvelope, FaTimesCircle, FaUserCircle, FaCheckCircle, FaCopy, FaCalendarAlt, FaSignOutAlt, FaPhoneAlt, FaMapMarkerAlt, FaLinkedin, FaGithub, FaFacebook, FaGlobe } from "react-icons/fa";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import { inputBase } from '../../utils/inputBase';
import Spinner from "../../components/ui/Spinner";

const MyProfile = () => {
  const [copied, setCopied] = useState(false)
  const { user, signOutUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    phoneNumber: user.phoneNumber || '',
    address: user.address || '',
    bio: user.bio || '',
    website: user.website || '',
    linkedin: user.linkedin || '',
    github: user.github || '',
    facebook: user.facebook || '',
  });
  // const queryClient = useQueryClient();

  // Fetch MongoDB user by email using React Query
  const {
    data: mongoUser,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['mongoUser', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const token = user.getIdToken ? await user.getIdToken() : null;
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        params: { search: user.email },
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data?.users?.find(u => u.email === user.email) || null;
    }
  });

  // logout user
  const handleLogOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Sign out!",
    }).then((result) => {
      if (result.isConfirmed) {
        signOutUser();
        Swal.fire({
          title: "Sign out!",
          text: "You have been Sign out.",
          icon: "success",
        })
          .then(() => { })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              title: "Error!",
              text: "Sign Out failed.",
              icon: "error",
            });
          });
      }
    });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // When entering edit mode, prefill form with latest mongoUser data
  useEffect(() => {
    if (editMode && mongoUser) {
      setProfile({
        phoneNumber: mongoUser.phoneNumber || '',
        address: mongoUser.address || '',
        bio: mongoUser.bio || '',
        website: mongoUser.website || '',
        linkedin: mongoUser.linkedin || '',
        github: mongoUser.github || '',
        facebook: mongoUser.facebook || '',
      });
    }
  }, [editMode, mongoUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = user && user.getIdToken ? await user.getIdToken() : null;
      if (!user || !mongoUser?._id || !token) {
        Swal.fire({ icon: 'error', title: 'User not authenticated' });
        return;
      }
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${mongoUser._id}`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditMode(false);
      await refetch();
      // Update local profile state with new values
      setProfile({
        phoneNumber: profile.phoneNumber,
        address: profile.address,
        bio: profile.bio,
        website: profile.website,
        linkedin: profile.linkedin,
        github: profile.github,
        facebook: profile.facebook,
      });
      Swal.fire({ icon: 'success', title: 'Profile updated!' });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Update failed', text: err?.message || 'Something went wrong' });
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="flex items-center justify-center min-h-screen py-4 px-2">
      <title>My Profile | Edu Sync</title>
      <div className="w-full max-w-4xl bg-base-100 rounded-md shadow-md border border-base-300 p-2 sm:p-6 md:p-10 flex flex-col items-center gap-6 animate-fade-in">
        {/* Avatar */}
        <div className="relative mb-2">
          <div className="w-32 md:w-40 h-32 md:h-40 p-1.5 rounded-full border-4 border-primary bg-base-200 flex items-center justify-center overflow-hidden shadow-md">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="User"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="w-28 h-28 text-base-content/40" />
            )}
          </div>
          {user.emailVerified &&
            <FaCheckCircle className="absolute bottom-3 right-2 text-success bg-base-100 rounded-full text-2xl border-2 border-base-100" title="Email Verified" />
          }
        </div>
        {/* Name & Email */}
        <h2 className="text-3xl font-bold text-primary flex items-center gap-2">
          {(mongoUser?.displayName || mongoUser?.name) ?? user.displayName ?? "User Name"}
        </h2>
        <div className="flex items-center gap-2 text-base-content/80">
          <FaEnvelope className="text-primary" />
          <span className="break-all">{mongoUser?.email || user.email}</span>
        </div>
        {/* Bio */}
        <div className="w-full text-center text-base-content/80 mb-2">
          {editMode ? (
            <div className="relative max-w-lg mx-auto flex items-center">
              <FaUserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-lg" />
              <textarea name="bio" value={profile.bio} onChange={handleProfileChange} className={`${inputBase} pl-10 max-w-lg rounded-md min-h-[48px]`} placeholder="Add a short bio..." rows={2} />
            </div>
          ) : (
            mongoUser?.bio ? mongoUser.bio : <span className="text-base-content/40">No bio provided.</span>
          )}
        </div>
        {/* Phone & Address */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div className="flex items-center gap-2 text-base-content/80 bg-base-200 rounded-lg px-4 py-3">
            <FaPhoneAlt className="text-primary" />
            <span className="font-semibold">Phone:</span>
            {editMode ? (
              <div className="relative w-full max-w-xs flex items-center">
                <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-base" />
                <input name="phoneNumber" value={profile.phoneNumber} onChange={handleProfileChange} className={`${inputBase} pl-10 rounded-md`} placeholder="Phone number" />
              </div>
            ) : (
              <span>{mongoUser?.phoneNumber || <span className="text-base-content/40">Not Provided</span>}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-base-content/80 bg-base-200 rounded-lg px-4 py-3">
            <FaMapMarkerAlt className="text-primary" />
            <span className="font-semibold">Address:</span>
            {editMode ? (
              <div className="relative w-full max-w-xs flex items-center">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-base" />
                <input name="address" value={profile.address} onChange={handleProfileChange} className={`${inputBase} pl-10 rounded-md`} placeholder="Address" />
              </div>
            ) : (
              <span>{mongoUser?.address || <span className="text-base-content/40">Not Provided</span>}</span>
            )}
          </div>
        </div>
        {/* Details */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2 text-base-content/80 bg-base-200 rounded-lg px-4 py-3">
            <FaCalendarAlt className="text-primary" />
            <span className="font-semibold">Account Created:</span>
            <span>
              {user.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-base-content/80 bg-base-200 rounded-lg px-4 py-3">
            <FaCalendarAlt className="text-primary" />
            <span className="font-semibold">Last Sign In:</span>
            <span>
              {user.metadata?.lastSignInTime
                ? new Date(user.metadata.lastSignInTime).toLocaleString()
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-base-content/80 bg-base-200 rounded-lg px-4 py-3 md:col-span-2">
            <FaUserCircle className="text-primary" />
            <span className="font-semibold">User ID:</span>
            <span className="break-all">{user.uid}</span>
            <CopyToClipboard text={user.uid} onCopy={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
              <button className="ml-2 text-primary hover:text-secondary transition-colors" title="Copy User ID">
                <FaCopy />
              </button>
            </CopyToClipboard>
            {copied && <span className="ml-1 text-success text-xs">Copied!</span>}
          </div>
          <div className="flex items-center gap-2 text-base-content/80 bg-base-200 rounded-lg px-4 py-3 md:col-span-2">
            <span className="font-semibold">Email Verified:</span>
            <span className={user.emailVerified ? "text-success" : "text-error"}>
              {user.emailVerified ? "Yes" : "No"}
            </span>
          </div>
        </div>
        {/* Social Media Links */}
        <div className="w-full flex flex-wrap justify-center gap-4 mt-4">
          {editMode ? (
            <>
              <div className="relative w-full max-w-xs flex items-center mb-2">
                <FaGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-base" />
                <input name="website" value={profile.website} onChange={handleProfileChange} className={`${inputBase} pl-10 rounded-md`} placeholder="Website" />
              </div>
              <div className="relative w-full max-w-xs flex items-center mb-2">
                <FaLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-base" />
                <input name="linkedin" value={profile.linkedin} onChange={handleProfileChange} className={`${inputBase} pl-10 rounded-md`} placeholder="LinkedIn" />
              </div>
              <div className="relative w-full max-w-xs flex items-center mb-2">
                <FaGithub className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-base" />
                <input name="github" value={profile.github} onChange={handleProfileChange} className={`${inputBase} pl-10 rounded-md`} placeholder="GitHub" />
              </div>
              <div className="relative w-full max-w-xs flex items-center mb-2">
                <FaFacebook className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-base" />
                <input name="facebook" value={profile.facebook} onChange={handleProfileChange} className={`${inputBase} pl-10 rounded-md`} placeholder="Facebook" />
              </div>
            </>
          ) : (
            <>
              <a href={mongoUser?.website || '#'} target="_blank" rel="noopener noreferrer" className="rounded-md bg-base-200 hover:bg-primary/10 p-3 transition-colors shadow text-primary text-xl" title="Website">
                <FaGlobe />
              </a>
              <a href={mongoUser?.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="rounded-md bg-base-200 hover:bg-primary/10 p-3 transition-colors shadow text-primary text-xl" title="LinkedIn">
                <FaLinkedin />
              </a>
              <a href={mongoUser?.github || '#'} target="_blank" rel="noopener noreferrer" className="rounded-md bg-base-200 hover:bg-primary/10 p-3 transition-colors shadow text-primary text-xl" title="GitHub">
                <FaGithub />
              </a>
              <a href={mongoUser?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="rounded-md bg-base-200 hover:bg-primary/10 p-3 transition-colors shadow text-primary text-xl" title="Facebook">
                <FaFacebook />
              </a>
            </>
          )}
        </div>
        <div className="w-full flex flex-col gap-2 items-center mt-8">
          {editMode ? (
            <div className="flex gap-2 w-full">
              <Button onClick={handleUpdate} variant="primary" className="flex-1">Save</Button>
              <Button onClick={() => setEditMode(false)} variant="ghost" className="flex-1">Cancel</Button>
            </div>
          ) : (
            <Button onClick={() => setEditMode(true)} variant="primary" className="w-full flex items-center justify-center gap-2">Update Profile</Button>
          )}
          <Button onClick={handleLogOut} variant="danger" className="w-full flex items-center justify-center gap-2 mt-2">
            <FaSignOutAlt /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
