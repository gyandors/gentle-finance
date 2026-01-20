import { useRef, useState } from "react";
import { NavLink, Outlet } from "react-router";
import { IoClose, IoMenu } from "react-icons/io5";

import useAuth from "../context/AuthContext";
import useClickOutside from "../hooks/useClickOutside";
import { createPortal } from "react-dom";

// TODO: Modify sidebar items based on user role
const sidebarItems = {
  customer: [
    {
      label: "Dashboard",
      to: "/dashboard",
    },
    {
      label: "Users",
      to: "users",
    },
    {
      label: "Loans",
      to: "loans",
    },
    {
      label: "Loan Applications",
      to: "loans-applications",
    },
    {
      label: "Profile",
      to: "profile",
    },
  ],
  employee: [
    {
      label: "Dashboard",
      to: "/dashboard",
    },
    {
      label: "Users",
      to: "users",
    },
    {
      label: "Loans",
      to: "loans",
    },
    {
      label: "Loan Applications",
      to: "loans-applications",
    },
    {
      label: "Profile",
      to: "profile",
    },
  ],
  admin: [
    {
      label: "Dashboard",
      to: "/dashboard",
    },
    {
      label: "Users",
      to: "users",
    },
    {
      label: "Loans",
      to: "loans",
    },
    {
      label: "Loan Applications",
      to: "loans-applications",
    },
    {
      label: "Profile",
      to: "profile",
    },
  ],
};

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const { logout, user } = useAuth();

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <aside className="px-4 bg-white hidden md:block">
        <div className="p-4">
          <img src="/svgs/logo.svg" alt="logo" className="h-10" />
        </div>
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed z-50 inset-0 bg-black/50 transition-opacity ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <aside
          className={`bg-white px-4 fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-200 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-4 pl-4 flex items-center justify-between">
            <img src="/svgs/logo.svg" alt="logo" className="h-8" />
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="md:hidden cursor-pointer hover:text-primary transition-colors"
              aria-label="Close sidebar"
            >
              <IoClose size={26} />
            </button>
          </div>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </aside>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <header className="bg-white border-b-2 border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="hover:text-primary cursor-pointer transition-colors"
                aria-label="Open sidebar"
              >
                <IoMenu size={26} />
              </button>
              <img src="/svgs/gen-fin.svg" alt="logo" className="h-4" />
            </div>
            <div></div>
            <div
              className="cursor-pointer"
              onClick={() => setIsDropdownOpen(true)}
            >
              {user?.profilePicture ? (
                <img
                  src={`${import.meta.env.VITE_API_IMAGE_URL}/${user.profilePicture}`}
                  alt="profile"
                  className="w-10 h-10 object-cover rounded-full border border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-lg font-semibold">
                    {user?.firstName[0]}
                    {user?.lastName[0]}
                  </span>
                </div>
              )}
              {isDropdownOpen &&
                createPortal(
                  <div className="fixed inset-0" style={{ zIndex: 100 }}>
                    <div
                      ref={dropdownRef}
                      className="absolute right-4 top-14 w-64 bg-white shadow-lg rounded-xl p-3 border border-gray-100 transform transition-all duration-200 ease-out"
                    >
                      <div className="text-center mb-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4">
                        {user?.profilePicture ? (
                          <img
                            src={`${import.meta.env.VITE_API_IMAGE_URL}/${user.profilePicture}`}
                            alt="profile"
                            className="w-16 h-16 object-cover rounded-full border-2 border-white shadow-md mx-auto mb-3"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                            <span className="text-primary text-lg font-semibold">
                              {user?.firstName[0]}
                              {user?.lastName[0]}
                            </span>
                          </div>
                        )}
                        <p className="font-semibold text-lg text-gray-800">
                          Hi, {user?.firstName}
                        </p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>
                      <button
                        className="cursor-pointer w-full text-center px-4 py-2.5 rounded-lg font-medium bg-gradient-to-r from-gray-50 to-gray-100 hover:from-red-50 hover:to-red-100 text-gray-700 hover:text-red-600 transition-all"
                        onClick={logout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>,
                  document.body
                )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <section className="p-4 md:m-4 bg-white md:rounded-lg h-full max-h-[calc(100vh-66px)] md:max-h-[calc(100vh-66px-32px)] overflow-y-auto scrollbar-small">
          <Outlet />
        </section>
      </div>
    </div>
  );
}

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const { user } = useAuth();
  const role = user?.role as keyof typeof sidebarItems;
  const navigationItems = sidebarItems[role] || [];

  return (
    <nav className="mt-4">
      {navigationItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => {
            const baseClass =
              "block px-4 py-2 my-2 rounded-md font-medium hover:bg-indigo-100 hover:text-primary transition-colors focus:outline-primary";
            return (
              baseClass +
              (isActive ? " bg-indigo-100 text-primary font-semibold" : "")
            );
          }}
          onClick={onClose}
          end={item.to === "/dashboard" ? true : false}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};
