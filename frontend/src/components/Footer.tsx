import { Link } from "react-router";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-600 border-t border-gray-200 px-4 md:px-20 py-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="space-x-4 min-w-64">
          <Link to="/privacy" className="hover:text-gray-800 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-gray-800 transition-colors">
            Terms of Service
          </Link>
        </div>
        <span className="text-gray-600 text-center grow">
          &copy; {new Date().getFullYear()} Gentle Finance. All rights reserved.
        </span>
        <div className="flex items-center gap-4 text-2xl min-w-64 justify-center md:justify-end">
          <a
            href="https://www.facebook.com"
            target="_blank"
            className="hover:text-gray-800 transition-colors"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            className="hover:text-gray-800 transition-colors"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            className="hover:text-gray-800 transition-colors"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
}
