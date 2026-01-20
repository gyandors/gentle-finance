import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { MdEmail, MdPhone, MdLocationOn, MdPerson } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

import TopProgressBar from "../../components/ui/TopProgressBar";
import { getToken } from "../../utils/auth";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function UserDetailsPage() {
  useDocumentTitle("User Details | Gentle Finance");

  const { id } = useParams();

  const { data: user = {}, isFetching } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserHandler(id!),
  });

  return (
    <div className="">
      <TopProgressBar isLoading={isFetching} />

      {/* Header Section */}
      <div className="relative h-48 bg-gradient-to-r from-primary to-primary/80 rounded-t-lg mb-24">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-8 md:-translate-x-0">
          {user.profilePicture ? (
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
      <div className="mb-4 md:ml-8">
        <h1 className="text-2xl font-bold ">
          {user.firstName} {user.lastName}
        </h1>
        <p className="text-gray-700">
          Member since{" "}
          {new Date(user.createdAt || "").toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="md:px-8 space-y-8">
        {/* Personal Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <MdPerson className="text-xl text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-gray-700">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <MdEmail className="text-xl text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-700">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <MdPhone className="text-xl text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-700">{user.phone || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <MdLocationOn className="text-xl text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-gray-700">
                  {user.city && user.state
                    ? `${user.city}, ${user.state}`
                    : "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Address Details
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Street Address</p>
              <p className="text-gray-700 mt-1">
                {user.address || "Not provided"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="text-gray-700 mt-1">
                  {user.city || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">State</p>
                <p className="text-gray-700 mt-1">
                  {user.state || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">PIN Code</p>
                <p className="text-gray-700 mt-1">
                  {user.pinCode || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Total Applications</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-1">
              {user.totalApplications || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Approved Loans</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-1">
              {user.approvedLoans || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Total Amount</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-1">
              ₹{user.totalAmount?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const getUserHandler = async (id: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const result = await response.json();

  if (response.ok) return result.data;
  return {};
};
