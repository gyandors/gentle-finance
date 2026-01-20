import { CgSpinner } from "react-icons/cg";

export const SubmitButton = ({
  isSubmitting,
  children,
}: {
  isSubmitting: boolean;
  children: React.ReactNode;
}) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full flex items-center justify-center cursor-pointer bg-gradient-to-b from-indigo-500 to-tertiary text-white py-2 px-4 rounded hover:from-indigo-600 hover:to-indigo-950 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:from-indigo-300 disabled:to-indigo-300 disabled:cursor-not-allowed"
    >
      {isSubmitting && <CgSpinner className="animate-spin mr-2 size-6" />}
      {children}
    </button>
  );
};

export const GradientButton = ({
  type = "button",
  onClick,
  className = "",
  children,
}: {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`cursor-pointer text-sm md:text-base bg-gradient-to-b from-indigo-500 to-tertiary text-white py-2 px-4 rounded hover:from-indigo-600 hover:to-indigo-950 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:from-indigo-300 disabled:to-indigo-300 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

export const RedGradientButton = ({
  type = "button",
  onClick,
  children,
  className = "",
}: {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`cursor-pointer text-sm md:text-base bg-gradient-to-b from-red-500 to-red-900 text-white py-2 px-4 rounded hover:from-red-600 hover:to-red-950 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:from-red-300 disabled:to-red-300 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

export const GreenGradientButton = ({
  type = "button",
  onClick,
  children,
  className = "",
}: {
  type?: "button" | "submit" | "reset";
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`cursor-pointer text-sm md:text-base bg-gradient-to-b from-green-500 to-green-900 text-white py-2 px-4 rounded hover:from-green-600 hover:to-green-950 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:from-green-300 disabled:to-green-300 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};
