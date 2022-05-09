import React, { useEffect, useRef, useState } from "react";

interface HeightProps {
  children: (height: number) => React.ReactElement;
  className?: string;
}

export const Height: React.FC<HeightProps> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    setHeight(containerRef.current.offsetHeight);
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {height && children(height)}
    </div>
  );
};
