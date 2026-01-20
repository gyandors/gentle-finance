import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";

import { Input } from "../components/ui/Input";
import { InfoModel } from "../components/ui/Model";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { SubmitButton } from "../components/ui/Button";
import { Loan } from "../types/loan";

interface FormData extends Loan {
  aadhar: FileList;
  pan: FileList;
}

export default function ApplyLoanPage() {
  useDocumentTitle("Apply Loan | Gentle Finance");

  const [aadharPreview, setAadharPreview] = useState<string | null>(null);
  const [panPreview, setPanPreview] = useState<string | null>(null);
  const [showModel, setShowModel] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("amount", data.amount);
    formData.append("purpose", data.purpose);
    formData.append("aadhar", data.aadhar[0]);
    formData.append("pan", data.pan[0]);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/loan-application/apply-loan`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
        throw new Error(result.message);
      }

      setShowModel({
        title: "Application Submitted",
        message: `Your application has been submitted successfully. Your application ID is ${result.data.applicationId}`,
      });
      reset();
      setAadharPreview(null);
      setPanPreview(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageRemove = (fieldName: "aadhar" | "pan") => {
    setValue(fieldName, new DataTransfer().files);
    if (fieldName === "aadhar") {
      setAadharPreview(null);
    } else {
      setPanPreview(null);
    }
  };

  return (
    <section className="px-4 md:px-20 py-8 flex flex-col gap-4 md:flex-row items-center justify-between">
      <div className="w-1/2 max-w-lg">
        <img
          src="svgs/apply-loan.svg"
          alt="Apply Loan"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 md:pl-20">
        <div className="mb-8 space-y-2">
          <img src="svgs/gen-fin.svg" alt="GenFin" className="h-4" />
          <h1 className="text-2xl text-gray-700 font-semibold">
            Apply for a Loan
          </h1>
          <p className="text-gray-500">
            Apply for a loan with Gentle Finance to get the best loan offers
            tailored to your needs.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              name="firstName"
              register={register}
              validation={{ required: "First name is required" }}
              error={errors.firstName}
            />

            <Input
              label="Last Name"
              placeholder="Doe"
              name="lastName"
              register={register}
              validation={{ required: "Last name is required" }}
              error={errors.lastName}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              placeholder="john.doe@example.com"
              name="email"
              type="email"
              register={register}
              validation={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              error={errors.email}
            />

            <Input
              label="Phone Number"
              placeholder="9999999999"
              name="phone"
              type="tel"
              register={register}
              validation={{
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              }}
              error={errors.phone}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Loan Amount"
              placeholder="5000"
              name="amount"
              type="number"
              register={register}
              validation={{
                required: "Loan amount is required",
                min: { value: 5000, message: "Minimum loan amount is 5000" },
              }}
              error={errors.amount}
            />

            <Input
              label="Purpose"
              name="purpose"
              type="select"
              register={register}
              validation={{ required: "Please select a loan purpose" }}
              error={errors.purpose}
              options={[
                { value: "personal", label: "Personal" },
                { value: "business", label: "Business" },
                { value: "education", label: "Education" },
                { value: "home", label: "Home" },
              ]}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">
              Upload Aadhar Card and Pan Card
            </p>
            <p className="text-xs font-normal text-gray-500 mb-1">
              Formats: PNG, JPG, JPEG up to 2MB
            </p>

            <div className="flex gap-4">
              <div
                className={`relative h-20 w-20 border-2 border-dashed rounded-md shadow-md ${
                  errors.aadhar ? "border-red-500" : "border-gray-400"
                }`}
              >
                {aadharPreview ? (
                  <div className="relative h-full">
                    <img
                      src={aadharPreview}
                      alt="Aadhar Preview"
                      className="h-full w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove("aadhar")}
                      className="absolute -top-2 -right-2 cursor-pointer bg-red-400 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                    >
                      <IoClose />
                    </button>
                  </div>
                ) : (
                  <>
                    <CiImageOn className="h-full w-full text-gray-400" />
                    <input
                      type="file"
                      id="aadhar"
                      accept=".jpg,.jpeg,.png"
                      {...register("aadhar", {
                        required: "Aadhar card is required",
                        validate: {
                          fileSize: (fileList: FileList) => {
                            const file = fileList?.[0];
                            const maxSize = 2 * 1024 * 1024;
                            return (
                              !file ||
                              file.size <= maxSize ||
                              "File must be less than 2MB"
                            );
                          },
                        },
                        onChange: (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setAadharPreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        },
                      })}
                      className="absolute inset-0 opacity-0"
                    />
                  </>
                )}
              </div>

              <div
                className={`relative h-20 w-20 border-2 border-dashed rounded-md shadow-md ${
                  errors.pan ? "border-red-500" : "border-gray-400"
                }`}
              >
                {panPreview ? (
                  <div className="relative h-full">
                    <img
                      src={panPreview}
                      alt="Pan Preview"
                      className="h-full w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove("pan")}
                      className="absolute -top-2 -right-2 cursor-pointer bg-red-400 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                    >
                      <IoClose />
                    </button>
                  </div>
                ) : (
                  <>
                    <CiImageOn className="h-full w-full text-gray-400" />
                    <input
                      type="file"
                      id="pan"
                      accept=".jpg,.jpeg,.png"
                      {...register("pan", {
                        required: "Pan card is required",
                        validate: {
                          fileSize: (fileList: FileList) => {
                            const file = fileList?.[0];
                            const maxSize = 2 * 1024 * 1024;
                            return (
                              !file ||
                              file.size <= maxSize ||
                              "File must be less than 2MB"
                            );
                          },
                        },
                        onChange: (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setPanPreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        },
                      })}
                      className="absolute inset-0 opacity-0"
                    />
                  </>
                )}
              </div>
            </div>
            {(errors.aadhar || errors.pan) && (
              <p className="text-red-500 text-sm mt-1">
                {errors.aadhar?.message || errors.pan?.message}
              </p>
            )}
          </div>

          <SubmitButton isSubmitting={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </SubmitButton>
        </form>
      </div>

      {showModel && (
        <InfoModel
          title={showModel.title}
          message={showModel.message}
          onClose={() => setShowModel(null)}
        />
      )}
    </section>
  );
}
