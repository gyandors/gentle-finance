import { MdEmail, MdPhone, MdLocationOn, MdWork } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

import useAuth from "../../context/AuthContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function ProfilePage() {
  useDocumentTitle("Profile | Gentle Finance");

  const { user } = useAuth();

  return (
    <>
      <div className="relative h-48 bg-gradient-to-r from-primary to-primary/80 rounded-t-lg mb-24">
        <div className="absolute -bottom-16 left-8 flex items-end">
          {user?.profilePicture ? (
            <img
              src={`${import.meta.env.VITE_API_IMAGE_URL}/${user.profilePicture}`}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white bg-white shadow-lg"
            />
          ) : (
            <FaUserCircle className="w-32 h-32 text-gray-400 bg-white rounded-full border-4 border-white" />
          )}
        </div>
      </div>

      <div className="px-8 space-y-8">
        {/* Basic Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-500 mt-1">
            Member since{" "}
            {new Date(user?.createdAt || "").toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white md:rounded-lg md:p-6 md:shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Contact Information
          </h2>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <MdEmail className="text-xl text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-700">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <MdPhone className="text-xl text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-700">{user?.phone || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <MdLocationOn className="text-xl text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-gray-700">{"Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <MdWork className="text-xl text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-gray-700 capitalize">
                {user?.role?.toLowerCase() || "User"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
