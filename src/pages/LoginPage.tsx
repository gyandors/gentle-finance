import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { MdKeyboardBackspace } from "react-icons/md";

import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Input } from "../components/ui/Input";
import { SubmitButton } from "../components/ui/Button";
import useAuth from "../context/AuthContext";

type EmailForm = {
  email: string;
};

type PasswordForm = {
  password: string;
};

type OtpForm = {
  otp: string;
};

let initial = true;

export default function LoginPage() {
  useDocumentTitle("Login | Gentle Finance");

  const [step, setStep] = useState<"email" | "password" | "otp">("email");
  const [userEmail, setUserEmail] = useState("");

  const [countdown, setCountdown] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(true);
  const [otpResent, setOtpResent] = useState<boolean>(false);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);

  const { login } = useAuth();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    setError: setEmailError,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
  } = useForm<EmailForm>();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    setError: setPasswordError,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordForm>();

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    setError: setOtpError,
    formState: { errors: otpErrors, isSubmitting: isOtpSubmitting },
  } = useForm<OtpForm>();

  const startResendTimer = () => {
    setCanResend(false);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const generateOtp = async (email: string) => {
    if (!initial) {
      setOtpLoading(true);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/generate-otp`,
        {
          method: "POST",
          body: JSON.stringify({ email: email }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      startResendTimer();

      if (!initial) {
        setOtpResent(true);
      }
      initial = false;
    } catch (error) {
      console.error(error);
    } finally {
      setOtpLoading(false);
    }
  };

  const onEmailSubmit = async (data: EmailForm) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/check-email`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setEmailError("email", { message: result.message, type: "manual" });
        throw new Error(result.message);
      }

      setUserEmail(data.email);
      const user = result.data;
      if (user.role === "admin" || user.role === "employee") {
        setStep("password");
      } else {
        generateOtp(data.email);
        setStep("otp");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          body: JSON.stringify({ email: userEmail, password: data.password }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setPasswordError("password", {
          message: result.message,
          type: "manual",
        });
        throw new Error(result.message);
      }

      login(result.token, result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onOtpSubmit = async (data: OtpForm) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        {
          method: "POST",
          body: JSON.stringify({ email: userEmail, otp: data.otp }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setOtpError("otp", {
          message: result.message,
          type: "manual",
        });
        throw new Error(result.message);
      }

      login(result.token, result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fadeInAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeInOut" },
  };

  return (
    <section className="px-4 md:px-20 py-8 flex flex-col gap-4 md:flex-row items-center justify-between">
      <div className="w-1/2 max-w-lg">
        <img
          src="svgs/login.svg"
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 md:pl-20">
        <div className="mb-8 space-y-2">
          {(step === "password" || step === "otp") && (
            <button
              onClick={() => setStep("email")}
              className="flex items-center cursor-pointer gap-2 mb-6 text-sm text-gray-500 hover:text-primary transition-colors"
            >
              <MdKeyboardBackspace size={24} />
              Back
            </button>
          )}
          <img src="svgs/gen-fin.svg" alt="GenFin" className="h-4" />
          <h2 className="text-2xl text-gray-700 font-semibold">
            {step === "email"
              ? "Sign in to your account"
              : step === "password"
              ? "Enter your password"
              : "Enter OTP"}
          </h2>
          <p className="text-gray-500">
            {step === "email"
              ? "Enter your email to sign in to your account"
              : step === "password"
              ? "Enter your password to sign in to your account"
              : "Enter the OTP sent to your email to verify your account"}
          </p>
          {step === "otp" && otpResent && (
            <p className="text-green-500 bg-green-50 text-sm p-2 rounded-md">
              OTP has been resent to your email
            </p>
          )}
        </div>

        <AnimatePresence>
          <motion.div key="email-form" {...fadeInAnimation}>
            {step === "email" && (
              <form
                className="space-y-4"
                onSubmit={handleEmailSubmit(onEmailSubmit)}
              >
                <Input
                  label="Email"
                  placeholder="john.doe@example.com"
                  name="email"
                  type="email"
                  register={registerEmail}
                  validation={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  error={emailErrors.email}
                />

                <SubmitButton isSubmitting={isEmailSubmitting}>
                  {isEmailSubmitting ? "Loading..." : "Continue"}
                </SubmitButton>
              </form>
            )}
          </motion.div>

          {step === "password" && (
            <motion.div key="password-form" {...fadeInAnimation}>
              <form
                className="space-y-4"
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              >
                <Input
                  label="Password"
                  placeholder="●●●●●●●●●●●●"
                  name="password"
                  type="password"
                  register={registerPassword}
                  validation={{
                    required: "Password is required",
                  }}
                  error={passwordErrors.password}
                />

                <SubmitButton isSubmitting={isPasswordSubmitting}>
                  {isPasswordSubmitting ? "Loading..." : "Sign in"}
                </SubmitButton>
              </form>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div key="otp-form" {...fadeInAnimation}>
              <form
                className="space-y-4"
                onSubmit={handleOtpSubmit(onOtpSubmit)}
              >
                <Input
                  label="OTP"
                  placeholder="●●●●●●"
                  name="otp"
                  type="number"
                  register={registerOtp}
                  validation={{
                    required: "OTP is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "OTP must be 6 digits",
                    },
                  }}
                  error={otpErrors.otp}
                />

                <SubmitButton isSubmitting={isOtpSubmitting}>
                  {isOtpSubmitting ? "Verifying..." : "Verify OTP"}
                </SubmitButton>

                <p className="text-gray-500 text-sm">
                  Didn't receive OTP?{" "}
                  {canResend ? (
                    <button
                      type="button"
                      disabled={otpLoading}
                      className="text-primary hover:text-secondary transition-colors font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => generateOtp(userEmail)}
                    >
                      {otpLoading ? "Resending..." : "Resend OTP"}
                    </button>
                  ) : (
                    <span className="text-gray-400">
                      Resend OTP in {countdown}s
                    </span>
                  )}
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
