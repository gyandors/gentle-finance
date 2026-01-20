import { useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import { GradientButton } from "./Button";
import ModelPortal from "./ModelPortal";

export function InfoModel({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, onClose);

  return (
    <ModelPortal>
      <div
        ref={modalRef}
        className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <GradientButton className="float-right" onClick={onClose}>
          Close
        </GradientButton>
      </div>
    </ModelPortal>
  );
}

export function LoanDetailsModel({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, () => onClose());

  return (
    <ModelPortal zIndex={200}>
      <div
        ref={modalRef}
        className="bg-white p-4 m-4 rounded-lg shadow-lg w-full max-w-2xl"
      >
        {children}
      </div>
    </ModelPortal>
  );
}

export function FullScreenImageModel({
  onClose,
  imageUrl,
}: {
  onClose: () => void;
  imageUrl: string;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, () => onClose());

  return (
    <ModelPortal zIndex={300}>
      <div ref={modalRef} className="rounded-lg max-w-md w-full shadow-lg">
        <img
          src={imageUrl}
          alt="Full screen"
          className="w-full h-full object-contain rounded-lg"
        />
      </div>
    </ModelPortal>
  );
}
