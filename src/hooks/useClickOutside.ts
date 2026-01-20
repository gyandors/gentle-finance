import { useEffect, RefObject } from "react";

type Handler = () => void;

function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: Handler
): void {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;

      // Get the z-index of current modal's backdrop
      const currentZIndex = ref.current?.parentElement?.style.zIndex;

      // Find if there are any modals with higher z-index
      const higherModals = document.querySelectorAll(".fixed");
      const hasHigherModal = Array.from(higherModals).some((modal) => {
        const modalZIndex = window.getComputedStyle(modal).zIndex;
        return parseInt(modalZIndex) > parseInt(currentZIndex || "0");
      });

      // Don't handle clicks if there's a modal with higher z-index
      if (hasHigherModal) {
        return;
      }

      // Handle click if it's outside the current modal
      if (ref.current && !ref.current.contains(target)) {
        handler();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler]);
}

export default useClickOutside;
