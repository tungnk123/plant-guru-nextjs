'use client'
import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'card';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className,
  size = 'default',
  variant = 'default',
  text = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const spinnerContent = (
    <div className={cn(
      "flex flex-col items-center justify-center gap-3",
      className
    )}>
      <Loader2 
        className={cn(
          "animate-spin text-orange-500",
          sizeClasses[size]
        )} 
      />
      {text && (
        <p className={cn(
          "text-gray-600 animate-pulse",
          size === 'sm' && "text-sm",
          size === 'lg' && "text-lg"
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (variant === 'card') {
    return (
      <Card className="bg-white/80 backdrop-blur-sm p-8 shadow-lg">
        {spinnerContent}
      </Card>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner; 