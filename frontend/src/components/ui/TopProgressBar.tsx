import { useEffect, useState } from "react";

interface TopProgressBarProps {
  isLoading: boolean;
}

export default function TopProgressBar({ isLoading }: TopProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let intervalId: number;

    if (isLoading) {
      setProgress(30); // Start with initial progress

      // Simulate progress
      intervalId = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 90) {
            // Don't complete fully until loading is done
            return prevProgress;
          }
          // Gradually slow down the progress
          const increment = (90 - prevProgress) / 10;
          return prevProgress + increment;
        });
      }, 500);
    } else {
      // When loading completes
      setProgress(100);
      // Reset after animation completes
      setTimeout(() => {
        setProgress(0);
      }, 500);
    }

    return () => clearInterval(intervalId);
  }, [isLoading]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div
        className="h-full rounded-r-full bg-primary transition-all duration-500 ease-out"
        style={{
          width: `${progress}%`,
          transition: "width 0.5s ease-out",
        }}
      />
    </div>
  );
}
