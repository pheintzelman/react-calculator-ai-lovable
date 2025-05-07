
import React from 'react';
import { cn } from '@/lib/utils';

type ButtonType = 'number' | 'operation' | 'equals' | 'clear' | 'backspace' | 'decimal' | 'undo';

interface CalculatorButtonProps {
  value: string;
  onClick: () => void;
  type?: ButtonType;
  className?: string;
  icon?: React.ReactNode;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  value,
  onClick,
  type = 'number',
  className,
  icon
}) => {
  const buttonClasses = cn(
    "flex items-center justify-center font-medium text-2xl py-5 bg-gray-100 hover:bg-gray-200 transition-colors border-none",
    {
      "text-gray-800": type === 'number' || type === 'decimal',
      "text-blue-600": type === 'operation' || type === 'equals',
      "text-red-600": type === 'clear',
      "text-green-600": type === 'undo',
    },
    className
  );

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      aria-label={value}
    >
      {icon || value}
    </button>
  );
};

export default CalculatorButton;
