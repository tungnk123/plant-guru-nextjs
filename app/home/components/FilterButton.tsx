import React from "react";
import { Button } from "@/components/ui/button";

type ButtonProps = {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
};

const FilterButton: React.FC<ButtonProps> = ({ label, isActive = false, onClick }) => {
  return (
    <Button
      className={`px-4 py-2 rounded-full border text-sm font-medium ${
        isActive
          ? "bg-yellow-300 text-black border-black"
          : "bg-white text-black border-black hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default FilterButton;
