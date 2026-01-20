import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { getToken } from "../../utils/auth";
import { Loan } from "../../types/loan";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import {
  GreenGradientButton,
  RedGradientButton,
} from "../../components/ui/Button";
import {
  FullScreenImageModel,
  LoanDetailsModel,
} from "../../components/ui/Model";
import toast from "react-hot-toast";
import TopProgressBar from "../../components/ui/TopProgressBar";

interface LoanApplication extends Loan {
  documents: {
    _id: string;
    type: string;
    filename: string;
    path: string;
  }[];
}

const statusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

export default function LoanApplicationsPage() {
  useDocumentTitle("Loan Applications | Gentle Finance");

  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") || "PENDING";
  const search = searchParams.get("search") || "";

  const [selectedStatus, setSelectedStatus] = useState<string>(status);
  const [searchQuery, setSearchQuery] = useState<string>(search);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data = [], isFetching } = useQuery({
    queryKey: ["loans", selectedStatus],
    queryFn: () => fetchLoans(selectedStatus),
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedStatus) params.set("status", selectedStatus);
    if (searchQuery) params.set("search", searchQuery);
    setSearchParams(params);
  }, [selectedStatus, searchQuery, setSearchParams]);

  // Handle status change
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setSearchParams((prev) => {
      prev.set("status", status);
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

  const handleUpdateLoan = async (applicationId: string, status: string) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/loan-application/update-loan/${applicationId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
        throw new Error(result.message);
      }

      toast.success(`Loan application ${status.toLowerCase()} successfully`);
      setSelectedLoan(null);
      queryClient.invalidateQueries({ queryKey: ["loans"] });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteLoan = async (applicationId: string) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/loan-application/delete-loan/${applicationId}`,
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

      toast.success("Loan application deleted successfully");
      setSelectedLoan(null);
      queryClient.invalidateQueries({ queryKey: ["loans"] });
    } catch (error) {
      console.error(error);
    }
  };

  // Filter loans
  const filteredLoans = data.filter((loan: LoanApplication) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${loan.firstName} ${loan.lastName}`.toLowerCase();
    return (
      loan.applicationId.toLowerCase().includes(query) ||
      fullName.includes(query)
    );
  });

  return (
    <>
      <h1 className="text-xl font-bold text-gray-700 mb-4">
        Loan Applications
      </h1>

      {/* Search and Status Filter Container */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by Application ID or Name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="space-x-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all focus:outline-primary ${
                selectedStatus === option.value
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => handleStatusChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loan Applications Table */}
      <div className="rounded-lg shadow overflow-auto">
        <table className="table-auto w-full text-sm md:text-base">
          <thead className="hidden md:table-header-group">
            <tr className="border-b border-gray-200 bg-gray-100">
              <th className="text-left p-4 w-20">Sl No.</th>
              <th className="text-left p-4 w-40">Application ID</th>
              <th className="text-left p-4 w-32">Date</th>
              <th className="text-left p-4 w-48">Name</th>
              <th className="text-left p-4 w-36">Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLoans.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 p-4">
                  No loan applications found
                </td>
              </tr>
            )}

            {filteredLoans.map((loan: LoanApplication, index: number) => (
              <tr
                key={loan._id}
                className="hover:bg-gray-50 hover:shadow transition-all cursor-pointer block p-4 space-y-2 md:table-row"
                onClick={() => setSelectedLoan(loan)}
              >
                <td className="block md:p-4 md:table-cell">
                  <span className="md:hidden font-semibold mr-2">Sl No:</span>
                  {index + 1}
                </td>
                <td className="block md:p-4 md:table-cell">
                  <span className="md:hidden font-semibold mr-2">
                    Application ID:
                  </span>
                  {loan.applicationId}
                </td>
                <td className="block md:p-4 md:table-cell">
                  <span className="md:hidden font-semibold mr-2">Date:</span>
                  {new Date(loan.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="block md:p-4 md:table-cell">
                  <span className="md:hidden font-semibold mr-2">Name:</span>
                  {loan.firstName} {loan.lastName}
                </td>
                <td className="block md:p-4 md:table-cell">
                  <span className="md:hidden font-semibold mr-2">Contact:</span>
                  {loan.phone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loan Details Modal */}
      {selectedLoan && (
        <LoanDetailsModel onClose={() => setSelectedLoan(null)}>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Application Details</h2>
              <button
                onClick={() => setSelectedLoan(null)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Application ID</p>
                <p>{selectedLoan.applicationId}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <p className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 block rounded-full ${getStatusColor(
                      selectedLoan.status
                    )}`}
                  ></span>
                  {selectedLoan.status}
                </p>
              </div>
              <div>
                <p className="font-semibold">Date</p>
                <p>
                  {new Date(selectedLoan.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div>
                <p className="font-semibold">Name</p>
                <p>
                  {selectedLoan.firstName} {selectedLoan.lastName}
                </p>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p>{selectedLoan.email}</p>
              </div>
              <div>
                <p className="font-semibold">Phone</p>
                <p>{selectedLoan.phone}</p>
              </div>
              <div>
                <p className="font-semibold">Amount</p>
                <p>₹{selectedLoan.amount}</p>
              </div>
            </div>
            <div className="text-sm">
              <p className="font-semibold mb-2">Documents</p>
              <div className="flex gap-4">
                {selectedLoan.documents.map((doc) => (
                  <img
                    key={doc._id}
                    src={`${import.meta.env.VITE_API_IMAGE_URL}/${doc.path}`}
                    alt={doc.filename}
                    className="h-24 w-24 object-contain rounded border border-gray-300 cursor-pointer hover:border-primary transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(
                        `${import.meta.env.VITE_API_IMAGE_URL}/${doc.path}`
                      );
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="space-x-2 text-right">
              {selectedLoan.status === "PENDING" ? (
                <>
                  <GreenGradientButton
                    onClick={() =>
                      handleUpdateLoan(selectedLoan.applicationId, "APPROVED")
                    }
                  >
                    Approve
                  </GreenGradientButton>
                  <RedGradientButton
                    onClick={() =>
                      handleUpdateLoan(selectedLoan.applicationId, "REJECTED")
                    }
                  >
                    Reject
                  </RedGradientButton>
                </>
              ) : (
                <RedGradientButton
                  onClick={() => handleDeleteLoan(selectedLoan.applicationId)}
                >
                  Delete
                </RedGradientButton>
              )}
            </div>
          </div>
        </LoanDetailsModel>
      )}

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <FullScreenImageModel
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
        />
      )}

      <TopProgressBar isLoading={isFetching} />
    </>
  );
}

const fetchLoans = async (status: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/loan-application?status=${status}`,
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500";
    case "APPROVED":
      return "bg-green-500";
    case "REJECTED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
