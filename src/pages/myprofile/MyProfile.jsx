import React, { useState } from "react";
import Swal from "sweetalert2";
import Button from "../../components/ui/Button";
import useAuth from "../../hooks/useAuth";
import { FaEnvelope, FaTimesCircle, FaUserCircle, FaCheckCircle, FaCopy, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { CopyToClipboard } from 'react-copy-to-clipboard';

const MyProfile = () => {
  const [copied, setCopied]=useState(false)
  const { user, signOutUser } = useAuth();
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
          .then(() => {})
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

  return (
    <div className="relative flex items-center justify-center overflow-hidden">
      <div className="relative z-10 w-full max-w-lg shadow-md">
        <div
          className="rounded-md shadow-md border border-base-300 bg-base-100 p-8 flex flex-col items-center gap-4 animate-fade-in"
          data-aos="zoom-in"
        >
          {/* Avatar */}
          <div className="relative mb-2">
            <div className="w-28 h-28 rounded-full border-4 border-primary bg-base-200 flex items-center justify-center overflow-hidden shadow-md">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-24 h-24 text-base-content/40" />
              )}
            </div>
            {user.emailVerified ? (
              <FaCheckCircle className="absolute bottom-2 right-2 text-success bg-base-100 rounded-full text-xl border-2 border-base-100" title="Email Verified" />
            ) : (
              <FaTimesCircle className="absolute bottom-2 right-2 text-error bg-base-100 rounded-full text-xl border-2 border-base-100" title="Email Not Verified" />
            )}
          </div>
          {/* Name & Email */}
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            {user.displayName || "User Name"}
          </h2>
          <div className="flex items-center gap-2 text-base-content/80">
            <FaEnvelope className="text-primary" />
            <span className="break-all">{user.email}</span>
          </div>
          {/* Details */}
          <div className="w-full mt-4 space-y-3">
            <div className="flex items-center gap-2 text-base-content/80">
              <FaCalendarAlt className="text-primary" />
              <span className="font-semibold">Account Created:</span>
              <span>
                {user.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-base-content/80">
              <FaCalendarAlt className="text-primary" />
              <span className="font-semibold">Last Sign In:</span>
              <span>
                {user.metadata?.lastSignInTime
                  ? new Date(user.metadata.lastSignInTime).toLocaleString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-base-content/80">
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
            <div className="flex items-center gap-2 text-base-content/80">
              <span className="font-semibold">Email Verified:</span>
              <span className={user.emailVerified ? "text-success" : "text-error"}>
                {user.emailVerified ? "Yes" : "No"}
              </span>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2 items-center mt-6">
            <Button onClick={handleLogOut} variant="danger" className="w-full flex items-center justify-center gap-2">
              <FaSignOutAlt /> Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
