import React from "react";

interface Props {
  children: React.ReactNode;
}

// Component Card chung
export default function CardDefault({ children }: Props) {
  return (
    <div className="px-4 py-4 rounded-xl overflow-hidden bg-custom_Primary border-2">
      {children}
    </div>
  );
}
