import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import useAuth from "../../context/AuthContext";
import CustomerDashboard from "../../components/dashboard/CustomerDashboard";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import EmployeeDashboard from "../../components/dashboard/EmployeeDashboard";

export default function DashboardPage() {
  useDocumentTitle("Dashboard | Gentle Finance");

  const { user } = useAuth();

  return (
    <>
      <h1 className="text-lg font-bold mb-4 italic">
        {getGreeting()}, {user?.firstName}
      </h1>
      {user?.role === "admin" ? (
        <AdminDashboard />
      ) : user?.role === "employee" ? (
        <EmployeeDashboard />
      ) : (
        <CustomerDashboard />
      )}
    </>
  );
}

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 0 && hour < 6) return "Good Night";
  if (hour >= 6 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 18) return "Good Afternoon";
  if (hour >= 18 && hour < 24) return "Good Evening";
};
