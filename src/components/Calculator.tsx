
import React, { useState } from 'react';
import CalculatorButton from './CalculatorButton';
import { Plus, Minus, X, Divide, Equal, CircleDot } from 'lucide-react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [currentOperation, setCurrentOperation] = useState<string | null>(null);
  const [resetDisplay, setResetDisplay] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [operationHistory, setOperationHistory] = useState<string>('');
  const [waitingForNextInput, setWaitingForNextInput] = useState(false);

  const appendValue = (value: string) => {
    if (resetDisplay || display === '0') {
      setDisplay(value);
      setResetDisplay(false);
      setWaitingForNextInput(false);
    } else if (display.length < 12) { // Limit the display length
      setDisplay(display + value);
    }
  };

  const appendDecimal = () => {
    if (resetDisplay) {
      setDisplay('0.');
      setResetDisplay(false);
      setWaitingForNextInput(false);
      return;
    }
    
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (operation: string) => {
    // If we have a pending operation, perform it first
    if (prevValue && currentOperation && !waitingForNextInput) {
      // Update operation history
      setOperationHistory(operationHistory + display + getOperationSymbol(operation));
      
      // Perform the pending calculation first
      const result = performCalculation();
      
      // Store the result as previous value for next calculation
      setPrevValue(result);
      setDisplay(result);
      setLastResult(result);
    } else {
      // If no pending operation, use the current display value
      setPrevValue(display);
      setLastResult(display);
      setOperationHistory(display + getOperationSymbol(operation));
    }
    
    setCurrentOperation(operation);
    setResetDisplay(true);
    setWaitingForNextInput(true);
  };

  const getOperationSymbol = (op: string): string => {
    switch(op) {
      case '+': return ' + ';
      case '-': return ' - ';
      case '×': return ' × ';
      case '÷': return ' ÷ ';
      default: return ' ';
    }
  };

  const performCalculation = (): string => {
    if (!prevValue || !currentOperation) return display;

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
          setWaitingForNextInput(true);
          return 'Error';
        }
        result = prev / current;
        break;
      default:
        return display;
    }

    // Format the result to avoid extremely long numbers
    // but preserve decimal precision when needed
    const formattedResult = 
      result.toString().length > 12 
        ? result.toExponential(6) 
        : result.toString();
    
    return formattedResult;
  };

  const handleEquals = () => {
    if (prevValue && currentOperation) {
      // Update operation history to show the complete calculation
      setOperationHistory(operationHistory + display + ' =');
      
      // Perform the calculation and update display
      const result = performCalculation();
      setDisplay(result);
      setLastResult(result);
      
      // Reset calculation state
      setPrevValue(null);
      setCurrentOperation(null);
      setResetDisplay(true);
      setWaitingForNextInput(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setCurrentOperation(null);
    setLastResult(null);
    setOperationHistory('');
    setResetDisplay(false);
    setWaitingForNextInput(false);
  };

  // Updated buttons layout to match the image
  const buttons = [
    // First row - Clear button takes full width
    { value: 'Clear', type: 'clear' as const, onClick: handleClear, className: 'col-span-4' },
    
    // Second row
    { value: '7', type: 'number' as const, onClick: () => appendValue('7') },
    { value: '8', type: 'number' as const, onClick: () => appendValue('8') },
    { value: '9', type: 'number' as const, onClick: () => appendValue('9') },
    { value: '÷', type: 'operation' as const, onClick: () => handleOperation('÷'), icon: <Divide size={24} /> },
    
    // Third row
    { value: '4', type: 'number' as const, onClick: () => appendValue('4') },
    { value: '5', type: 'number' as const, onClick: () => appendValue('5') },
    { value: '6', type: 'number' as const, onClick: () => appendValue('6') },
    { value: '×', type: 'operation' as const, onClick: () => handleOperation('×'), icon: <X size={24} /> },
    
    // Fourth row
    { value: '1', type: 'number' as const, onClick: () => appendValue('1') },
    { value: '2', type: 'number' as const, onClick: () => appendValue('2') },
    { value: '3', type: 'number' as const, onClick: () => appendValue('3') },
    { value: '-', type: 'operation' as const, onClick: () => handleOperation('-'), icon: <Minus size={24} /> },
    
    // Fifth row
    { value: '0', type: 'number' as const, onClick: () => appendValue('0') },
    { value: '.', type: 'decimal' as const, onClick: appendDecimal, icon: <CircleDot size={18} /> },
    { value: '=', type: 'equals' as const, onClick: handleEquals, icon: <Equal size={24} /> },
    { value: '+', type: 'operation' as const, onClick: () => handleOperation('+'), icon: <Plus size={24} /> },
  ];

  // Format the display for better readability
  const displayValue = display === 'Error' 
    ? display 
    : new Intl.NumberFormat('en-US', { 
        maximumFractionDigits: 20,
        useGrouping: true
      }).format(Number(display) || 0);

  return (
    <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden max-w-xs w-full mx-auto border border-gray-300">
      {/* Calculator Display */}
      <div className="bg-gray-500 p-4 text-right h-24 flex flex-col justify-end">
        {/* History display */}
        <div className="text-gray-300 text-sm font-medium truncate mb-1 h-5">
          {operationHistory}
        </div>
        {/* Current result display */}
        <div className="text-white text-3xl font-medium truncate">
          {displayValue}
        </div>
      </div>
      
      {/* Calculator Buttons */}
      <div className="grid grid-cols-4 gap-px bg-gray-300">
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
