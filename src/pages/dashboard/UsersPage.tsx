import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MdModeEdit, MdDelete } from "react-icons/md";

import { User } from "../../types/auth";
import { GradientButton } from "../../components/ui/Button";
import { getToken } from "../../utils/auth";
import TopProgressBar from "../../components/ui/TopProgressBar";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import toast from "react-hot-toast";

const userTypes = [
  { value: "customer", label: "Customer" },
  { value: "employee", label: "Employee" },
  { value: "admin", label: "Admin" },
];

export default function UsersPage() {
  useDocumentTitle("Users | Gentle Finance");

  const [searchParams, setSearchParams] = useSearchParams();
  const role = searchParams.get("role") || "customer";
  const search = searchParams.get("search") || "";

  const [selectedUserRole, setSelectedUserRole] = useState(role);
  const [searchQuery, setSearchQuery] = useState(search);

  const { data = [], isFetching } = useQuery({
    queryKey: ["users", selectedUserRole],
    queryFn: () => fetchUsers(selectedUserRole),
  });

  const queryClient = useQueryClient();

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedUserRole) params.set("role", selectedUserRole);
    if (searchQuery) params.set("search", searchQuery);
    setSearchParams(params);
  }, [selectedUserRole, searchQuery, setSearchParams]);

  // Handle role change
  const handleRoleChange = (role: string) => {
    setSelectedUserRole(role);
    setSearchParams((prev) => {
      prev.set("role", role);
      return prev;
    });
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchParams((prev) => {
      if (value) {
        prev.set("search", value);
      } else {
        prev.delete("search");
      }
      return prev;
    });
  };

  // Filter users
  const filteredUsers = data.filter((user: User) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (
      fullName.includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.toLowerCase().includes(query)
    );
  });

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
        throw new Error(result.message);
      }

      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditUser = (id: string) => {
    console.log(id);
    // TODO: Implement edit user
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-700">Users</h1>
        <Link to="create">
          <GradientButton>Add User</GradientButton>
        </Link>
      </div>

      {/* Search and Role Filter Container */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Role Filter */}
        <div className="space-x-2">
          {userTypes.map((option) => (
            <button
              key={option.value}
              className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all focus:outline-primary ${
                selectedUserRole === option.value
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => handleRoleChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No users found
          </div>
        ) : (
          filteredUsers.map((user: User) => (
            <Link
              to={`${user._id}`}
              key={user._id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow group relative"
            >
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-2 cursor-pointer rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEditUser(user._id);
                  }}
                >
                  <MdModeEdit className="size-5" />
                </button>
                <button
                  className="p-2 cursor-pointer rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteUser(user._id);
                  }}
                >
                  <MdDelete className="size-5" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                {user.profilePicture ? (
                  <img
                    src={`${import.meta.env.VITE_API_IMAGE_URL}/${user.profilePicture}`}
                    alt={user.firstName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-lg font-semibold">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {user.role && (
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                )}
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    user.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                <p>📞 {user.phone}</p>
                <p>
                  📅 Joined on{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

      <TopProgressBar isLoading={isFetching} />
    </>
  );
}

const fetchUsers = async (role: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/user?role=${role}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  const result = await response.json();

  if (response.ok) return result.data;
  return [];
};
