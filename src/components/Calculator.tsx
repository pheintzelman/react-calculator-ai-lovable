import React, { useState } from 'react';
import CalculatorButton from './CalculatorButton';
import { Plus, Minus, X, Divide, Equal, ArrowLeft, CircleDot } from 'lucide-react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [currentOperation, setCurrentOperation] = useState<string | null>(null);
  const [resetDisplay, setResetDisplay] = useState(false);

  const appendValue = (value: string) => {
    if (display === '0' || resetDisplay) {
      setDisplay(value);
      setResetDisplay(false);
    } else if (display.length < 12) { // Limit the display length
      setDisplay(display + value);
    }
  };

  const appendDecimal = () => {
    if (resetDisplay) {
      setDisplay('0.');
      setResetDisplay(false);
      return;
    }
    
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (operation: string) => {
    if (prevValue && currentOperation && !resetDisplay) {
      performCalculation();
    }
    
    setPrevValue(display);
    setCurrentOperation(operation);
    setResetDisplay(true);
  };

  const performCalculation = () => {
    if (!prevValue || !currentOperation) return;

    const prev = parseFloat(prevValue);
    const current = parseFloat(display);
    let result: number;

    switch (currentOperation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        if (current === 0) {
          setDisplay('Error');
          setPrevValue(null);
          setCurrentOperation(null);
          setResetDisplay(true);
          return;
        }
        result = prev / current;
        break;
      default:
        return;
    }

    // Format the result to avoid extremely long numbers
    // but preserve decimal precision when needed
    const formattedResult = 
      result.toString().length > 12 
        ? result.toExponential(6) 
        : result.toString();
    
    setDisplay(formattedResult);
    setPrevValue(null);
    setCurrentOperation(null);
    setResetDisplay(true);
  };

  const handleEquals = () => {
    if (prevValue && currentOperation) {
      performCalculation();
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setCurrentOperation(null);
    setResetDisplay(false);
  };

  const handleBackspace = () => {
    if (display === '0' || display === 'Error' || resetDisplay) {
      return;
    }
    
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  // Rearranged the buttons to have operations on the right column
  const buttons = [
    { value: 'C', type: 'clear' as const, onClick: handleClear },
    { value: '←', type: 'backspace' as const, onClick: handleBackspace, icon: <ArrowLeft size={24} /> },
    { value: '7', type: 'number' as const, onClick: () => appendValue('7') },
    { value: '÷', type: 'operation' as const, onClick: () => handleOperation('÷'), icon: <Divide size={24} /> },

    { value: '8', type: 'number' as const, onClick: () => appendValue('8') },
    { value: '9', type: 'number' as const, onClick: () => appendValue('9') },
    { value: '4', type: 'number' as const, onClick: () => appendValue('4') },
    { value: '×', type: 'operation' as const, onClick: () => handleOperation('×'), icon: <X size={24} /> },

    { value: '5', type: 'number' as const, onClick: () => appendValue('5') },
    { value: '6', type: 'number' as const, onClick: () => appendValue('6') },
    { value: '1', type: 'number' as const, onClick: () => appendValue('1') },
    { value: '-', type: 'operation' as const, onClick: () => handleOperation('-'), icon: <Minus size={24} /> },

    { value: '2', type: 'number' as const, onClick: () => appendValue('2') },
    { value: '3', type: 'number' as const, onClick: () => appendValue('3') },
    { value: '0', type: 'number' as const, onClick: () => appendValue('0') },
    { value: '+', type: 'operation' as const, onClick: () => handleOperation('+'), icon: <Plus size={24} /> },

    { value: '.', type: 'decimal' as const, onClick: appendDecimal, icon: <CircleDot size={18} />, className: 'col-span-2' },
    { value: '=', type: 'equals' as const, onClick: handleEquals, icon: <Equal size={24} />, className: 'col-span-2' },
  ];

  // Format the display for better readability
  const displayValue = display === 'Error' 
    ? display 
    : new Intl.NumberFormat('en-US', { 
        maximumFractionDigits: 20,
        useGrouping: true
      }).format(Number(display) || 0);

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden max-w-md w-full mx-auto">
      {/* Calculator Display */}
      <div className="bg-calculator-display p-6 text-right">
        <div className="text-gray-400 h-6 text-lg">
          {prevValue && `${prevValue} ${currentOperation}`}
        </div>
        <div className="text-white text-4xl font-bold truncate h-12">
          {displayValue}
        </div>
      </div>
      
      {/* Calculator Buttons */}
      <div className="grid grid-cols-4 gap-2 p-4 bg-gray-900">
        {buttons.map((button, index) => (
          <CalculatorButton
            key={index}
            value={button.value}
            onClick={button.onClick}
            type={button.type}
            className={button.className}
            icon={button.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default Calculator;
