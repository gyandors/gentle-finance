import { UseFormRegister, FieldError, RegisterOptions } from "react-hook-form";

interface InputProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  validation?: RegisterOptions;
  options?: { value: string; label: string }[];
}

export function Input({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
  validation,
  options,
}: InputProps) {
  const inputStyles = `w-full p-2 rounded shadow-md transition-colors focus:outline-none placeholder:text-slate-300 ${
    error
      ? "ring-1 ring-inset ring-red-500 focus:ring-red-500"
      : "ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-primary"
  }`;

  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      {type === "select" ? (
        <select
          {...register(name, validation)}
          id={name}
          className={inputStyles + " py-2.5"}
        >
          <option value="">Select {label}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...register(name, validation)}
          type={type}
          id={name}
          className={inputStyles}
          placeholder={placeholder}
        />
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
