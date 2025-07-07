import React from "react";
import Swal from "sweetalert2";
import Button from "../../components/ui/Button";
import useAuth from "../../hooks/useAuth";

const MyProfile = () => {
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
    <div className="flex justify-center items-center min-h-[70vh]">
      <title>Profile || Career Code</title>
      <div className="card w-full max-w-md bg-base-100 shadow-sm border-t-4 border-primary p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="avatar">
            <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={user.photoURL || "/src/assets/user-logo.png"}
                alt="User"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-1">
            {user.displayName || "User Name"}
          </h2>
          <span className="badge badge-outline badge-primary mb-2">
            {user.email}
          </span>
        </div>
        <div className="divider">Profile Details</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Account Created:</span>
            <span className="text-base-content/70">
              {user.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Last Sign In:</span>
            <span className="text-base-content/70">
              {user.metadata?.lastSignInTime
                ? new Date(user.metadata.lastSignInTime).toLocaleString()
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">User ID:</span>
            <span className="text-base-content/70 break-all">{user.uid}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Email Verified:</span>
            <span
              className={user.emailVerified ? "text-green-600" : "text-red-500"}
            >
              {user.emailVerified ? "Yes" : "No"}
            </span>
          </div>
        </div>
        <div className="divider"></div>
        <div className="flex flex-col gap-2 items-center">
          <Button onClick={handleLogOut} variant="danger">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
