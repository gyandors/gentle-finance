import { Routes, Route, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import ApplyLoanPage from "./pages/ApplyLoanPage";
import LoanStatusPage from "./pages/LoanStatusPage";
import LoginPage from "./pages/LoginPage";

import useAuth from "./context/AuthContext";

import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import LoanApplicationsPage from "./pages/dashboard/LoanApplicationsPage";
import HomeLayout from "./layouts/HomeLayout";
import UsersPage from "./pages/dashboard/UsersPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import LoansPage from "./pages/dashboard/LoansPage";
import CreateUserPage from "./pages/dashboard/CreateUserPage";
import UserDetailsPage from "./pages/dashboard/UserDetailsPage";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {!isAuthenticated && <Header />}
      <main className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <HomeLayout />
            }
          >
            <Route index element={<LandingPage />} />
            <Route path="/apply" element={<ApplyLoanPage />} />
            <Route path="/status" element={<LoanStatusPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <DashboardLayout /> : <Navigate to="/" />
            }
          >
            <Route index element={<DashboardPage />} />
            <Route
              path="loans-applications"
              element={<LoanApplicationsPage />}
            />

            <Route path="users">
              <Route index element={<UsersPage />} />
              <Route path="create" element={<CreateUserPage />} />
              <Route path=":id" element={<UserDetailsPage />} />
            </Route>

            <Route path="profile" element={<ProfilePage />} />
            <Route path="loans" element={<LoansPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isAuthenticated && <Footer />}

      <Toaster
        toastOptions={{
          style: {
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "16px",
          },
        }}
      />
    </>
  );
}
