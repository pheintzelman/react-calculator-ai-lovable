
import React from 'react';
import { cn } from '@/lib/utils';

type ButtonType = 'number' | 'operation' | 'equals' | 'clear' | 'backspace' | 'decimal';

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
    "flex items-center justify-center text-white font-semibold text-2xl rounded-lg p-4 transition-all active:animate-button-press",
    {
      "bg-calculator-numbers hover:bg-gray-600": type === 'number' || type === 'decimal',
      "bg-calculator-operations hover:bg-amber-500": type === 'operation',
      "bg-calculator-equals hover:bg-blue-500": type === 'equals',
      "bg-calculator-clear hover:bg-red-500": type === 'clear' || type === 'backspace',
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
