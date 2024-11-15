// components/home/ButtonCardGrid.tsx
'use client';

import React from 'react';
import ButtonCard from '@/app/components/home/ButtonCard';

interface ButtonCardProps {
  title: string;
  subtitle: string;
  icon: string;
  onClick: () => void;
}

interface ButtonCardGridProps {
  buttons: ButtonCardProps[];
}

const ButtonCardGrid: React.FC<ButtonCardGridProps> = ({ buttons }) => {
  return (
    <div className="grid grid-cols-1 gap-6 px-6 sm:grid-cols-2 md:grid-cols-3">
      {buttons.map((button, index) => (
        <ButtonCard key={index} {...button} />
      ))}
    </div>
  );
};

export default ButtonCardGrid;
