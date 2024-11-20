import { Button } from "@/components/ui/button";
import React from "react";

interface PrimaryButtonProps {
  text: string; 
  icon?: React.ReactNode;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ text, icon, className }) => {
  return (
    <Button className={`bg-yellow-300 hover:bg-yellow-600 text-black flex items-center gap-2 ${className}`}>
      {icon}
      {text}
    </Button>
  );
};

export default PrimaryButton;
