import { useForm } from "react-hook-form";
import { useState } from "react";

import { Input } from "../components/ui/Input";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { SubmitButton } from "../components/ui/Button";
import { Loan } from "../types/loan";

export default function LoanStatusPage() {
  useDocumentTitle("Loan Status | Gentle Finance");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Loan>();

  const [application, setApplication] = useState<Loan | null>(null);

  const onSubmit = async (data: Loan) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/loan-application/loan-status/${
          data.applicationId
        }`
      );
      const result = await response.json();

      if (!response.ok) {
        setApplication(result);
        throw new Error(result.message);
      }

      setApplication(result.data);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="px-4 md:px-20 py-8 flex flex-col gap-4 md:flex-row items-center justify-between">
      <div className="w-1/2 max-w-lg">
        <img
          src="svgs/loan-status.svg"
          alt="Loan Status"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 md:pl-20">
        <div className="mb-8 space-y-2">
          <img src="svgs/gen-fin.svg" alt="GenFin" className="h-4" />
          <h1 className="text-2xl text-gray-700 font-semibold">
            Check Loan Status
          </h1>
          <p className="text-gray-500">
            Check the status of your loan application with Gentle Finance.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Application ID"
            placeholder="Enter your 16 digit application ID"
            name="applicationId"
            register={register}
            validation={{ required: "Application ID is required" }}
            error={errors.applicationId}
          />

          <SubmitButton isSubmitting={isSubmitting}>
            {isSubmitting ? "Checking..." : "Check Status"}
          </SubmitButton>
        </form>

        {application && (
          <div className="mt-6 rounded">
            {application.applicationId ? (
              <>
                <h2 className="font-semibold mb-2">Application Details</h2>
                <p>
                  Status: {application.status}
                  <br />
                  Date of Application:{" "}
                  {new Date(application.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </>
            ) : (
              <p>Loan application not found</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
