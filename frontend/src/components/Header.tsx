import { useState } from "react";
import { Link, NavLink } from "react-router";
import { IoClose, IoMenu } from "react-icons/io5";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm px-4 py-4 md:py-0 md:px-20 sticky top-0 z-10">
      <nav className="flex justify-between items-center">
        <Link to="/">
          <img src="svgs/logo.svg" alt="Logo" className="h-7 md:h-10" />
        </Link>

        {/* Hamburger button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden cursor-pointer hover:text-primary transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <IoClose size={26} /> : <IoMenu size={26} />}
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8 font-medium">
          <NavLink
            to="/apply"
            className="hover:text-primary py-6 border-b-2 border-transparent transition-colors text-gray-500 focus:outline-primary"
          >
            Apply for Loan
          </NavLink>
          <NavLink
            to="/status"
            className="hover:text-primary py-6 border-b-2 border-transparent transition-colors text-gray-500 focus:outline-primary"
          >
            Check Status
          </NavLink>
          <Link
            to="/login"
            className="rounded bg-gradient-to-b from-indigo-500 to-indigo-900 hover:from-indigo-600 hover:to-indigo-950 transition-colors text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            Login
          </Link>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[300px]" : "max-h-0"
          }`}
        >
          <div className="flex flex-col">
            <NavLink
              to="/apply"
              className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Apply for Loan
            </NavLink>
            <NavLink
              to="/status"
              className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Check Status
            </NavLink>
            <NavLink
              to="/login"
              className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}
