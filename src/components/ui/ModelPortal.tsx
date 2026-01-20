import { createPortal } from "react-dom";

export default function ModelPortal({
  zIndex = 100,
  children,
}: {
  zIndex?: number;
  children: React.ReactNode;
}) {
  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      style={{ zIndex }}
    >
      {children}
    </div>,
    document.body
  );
}
