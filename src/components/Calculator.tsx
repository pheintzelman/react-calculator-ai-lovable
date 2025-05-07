
import React, { useState, useEffect } from 'react';
import CalculatorButton from './CalculatorButton';
import { Plus, Minus, X, Divide, Equal, Circle, Undo2 } from 'lucide-react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [currentOperation, setCurrentOperation] = useState<string | null>(null);
  const [resetDisplay, setResetDisplay] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [operationHistory, setOperationHistory] = useState<string>('');
  const [waitingForNextInput, setWaitingForNextInput] = useState(false);
  const [history, setHistory] = useState<{
    display: string;
    prevValue: string | null;
    currentOperation: string | null;
    operationHistory: string;
    lastResult: string | null;
  }[]>([]);
  const [lastClearIndex, setLastClearIndex] = useState(0);

  const saveToHistory = () => {
    setHistory([
      ...history, 
      {
        display,
        prevValue,
        currentOperation,
        operationHistory,
        lastResult
      }
    ]);
  };

  const handleUndo = () => {
    // Only go back to the last clear operation
    if (history.length > lastClearIndex) {
      const lastState = history[lastClearIndex];
      setDisplay(lastState.display);
      setPrevValue(lastState.prevValue);
      setCurrentOperation(lastState.currentOperation);
      setOperationHistory(lastState.operationHistory);
      setLastResult(lastState.lastResult);
      setHistory(history.slice(0, lastClearIndex));
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      
      // Check for Control+Z
      if (key === 'z' && event.ctrlKey) {
        handleUndo();
        return;
      }

      // Number keys (0-9)
      if (/^[0-9]$/.test(key)) {
        appendValue(key);
      }
      // Decimal point
      else if (key === '.') {
        appendDecimal();
      }
      // Operations
      else if (key === '+') {
        handleOperation('+');
      }
      else if (key === '-') {
        handleOperation('-');
      }
      else if (key === '*' || key === 'x') {
        handleOperation('×');
      }
      else if (key === '/') {
        handleOperation('÷');
      }
      // Equals (Enter or =)
      else if (key === '=' || key === 'Enter') {
        handleEquals();
      }
      // Clear (Escape)
      else if (key === 'Escape') {
        handleClear();
      }
      // Delete key to clear
      else if (key === 'Delete' || key === 'Backspace') {
        handleClear();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [display, prevValue, currentOperation, resetDisplay, history, lastClearIndex]); // Include all dependencies

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

  const handleNegative = () => {
    // If we're expecting a new number input (after an operation)
    if (waitingForNextInput || resetDisplay) {
      setDisplay('-');
      setResetDisplay(false);
      setWaitingForNextInput(false);
      return;
    }

    // Toggle between negative and positive
    if (display.startsWith('-')) {
      setDisplay(display.substring(1));
    } else {
      setDisplay('-' + display);
    }
  };

  const handleOperation = (operation: string) => {
    // Save current state before operation
    saveToHistory();

    // Check for special minus case for negative numbers
    if (operation === '-' && (display === '0' || waitingForNextInput)) {
      handleNegative();
      return;
    }
  
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
    } else if (waitingForNextInput && currentOperation) {
      // If the user presses an operation key after another operation key,
      // update the operation without changing the numbers
      setOperationHistory(operationHistory.slice(0, -3) + getOperationSymbol(operation));
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
    // Save current state before equals
    saveToHistory();

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
    // Save current state before clearing
    if (display !== '0') {
      saveToHistory();
    }

    // Set the current history length as the last clear index
    // This allows undo to only go back to this point
    setLastClearIndex(history.length);

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
    // First row - Clear button and Undo
    { value: 'Clear', type: 'clear' as const, onClick: handleClear, className: 'col-span-3' },
    { value: 'Undo', type: 'undo' as const, onClick: handleUndo, icon: <Undo2 size={24} /> },
    
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
    { value: '.', type: 'decimal' as const, onClick: appendDecimal, icon: <Circle size={16} /> },
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
