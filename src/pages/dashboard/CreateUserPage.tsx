import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { IoClose, IoImageOutline } from "react-icons/io5";

import { User } from "../../types/auth";
import { Input } from "../../components/ui/Input";
import { RedGradientButton, SubmitButton } from "../../components/ui/Button";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { getToken } from "../../utils/auth";

interface FormData extends User {
  profile: FileList;
}

export default function CreateUserPage() {
  useDocumentTitle("Create User | Gentle Finance");

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("profile", data.profile[0]);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("password", data.password);
      formData.append("role", data.role);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/create`,
        {
          method: "POST",
          body: formData,
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

      toast.success("User created successfully");
      navigate("/dashboard/users");
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageRemove = () => {
    setValue("profile", new DataTransfer().files);
    setProfilePreview(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-700">Create New User</h1>
        <Link to="/dashboard/users">
          <RedGradientButton>Cancel</RedGradientButton>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <div
            className={`relative h-28 w-28 border-2 border-dashed rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors ${
              errors.profile ? "border-red-500" : "border-gray-400"
            }`}
          >
            {profilePreview ? (
              <div className="relative h-full w-full">
                <img
                  src={profilePreview}
                  alt="Profile Preview"
                  className="h-full w-full object-cover rounded-full"
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute top-0 right-0 cursor-pointer bg-red-400 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                >
                  <IoClose />
                </button>
              </div>
            ) : (
              <>
                <IoImageOutline size={40} className="text-gray-400" />
                <input
                  type="file"
                  id="profile"
                  accept=".jpg,.jpeg,.png"
                  {...register("profile", {
                    required: "Profile picture is required",
                    validate: {
                      fileSize: (fileList: FileList) => {
                        const file = fileList?.[0];
                        const maxSize = 2 * 1024 * 1024; // 2MB
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
                          setProfilePreview(reader.result as string);
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
          {errors.profile && (
            <p className="text-red-500 text-sm mt-1">
              {errors.profile.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="firstName"
            type="text"
            placeholder="First Name"
            register={register}
            validation={{ required: "First Name is required" }}
            error={errors.firstName}
          />
          <Input
            label="Last Name"
            name="lastName"
            type="text"
            placeholder="Last Name"
            register={register}
            validation={{ required: "Last Name is required" }}
            error={errors.lastName}
          />
        </div>

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Email"
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
          label="Phone"
          name="phone"
          type="tel"
          placeholder="Phone Number"
          register={register}
          validation={{
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Invalid phone number",
            },
          }}
          error={errors.phone}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Password"
          register={register}
          validation={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          error={errors.password}
        />

        <div>
          <label className="text-sm font-medium text-gray-700 block">
            User Role
          </label>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register("role", { required: "Role is required" })}
                value="customer"
                className="form-radio text-primary"
              />
              <span className="ml-2">Customer</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register("role", { required: "Role is required" })}
                value="employee"
                className="form-radio text-primary"
              />
              <span className="ml-2">Employee</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register("role", { required: "Role is required" })}
                value="admin"
                className="form-radio text-primary"
              />
              <span className="ml-2">Admin</span>
            </label>
          </div>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>
        <SubmitButton isSubmitting={isSubmitting}>
          {isSubmitting ? "Creating User..." : "Create User"}
        </SubmitButton>
      </form>
    </>
  );
}
