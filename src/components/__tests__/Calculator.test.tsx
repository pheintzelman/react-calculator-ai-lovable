
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Calculator from '../Calculator';

describe('Calculator Component', () => {
  beforeEach(() => {
    render(<Calculator />);
  });

  test('renders the calculator component', () => {
    expect(screen.getByText('Clear')).toBeInTheDocument();
    expect(screen.getByText('Undo')).toBeInTheDocument();
  });

  test('displays the number when a digit is clicked', () => {
    fireEvent.click(screen.getByText('5'));
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('performs addition correctly', () => {
    // Press 3 + 5 =
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByLabelText('+'));
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByLabelText('='));
    
    // The result should be 8
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  test('performs subtraction correctly', () => {
    // Press 9 - 4 =
    fireEvent.click(screen.getByText('9'));
    fireEvent.click(screen.getByLabelText('-'));
    fireEvent.click(screen.getByText('4'));
    fireEvent.click(screen.getByLabelText('='));
    
    // The result should be 5
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('performs multiplication correctly', () => {
    // Press 6 × 7 =
    fireEvent.click(screen.getByText('6'));
    fireEvent.click(screen.getByLabelText('×'));
    fireEvent.click(screen.getByText('7'));
    fireEvent.click(screen.getByLabelText('='));
    
    // The result should be 42
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  test('performs division correctly', () => {
    // Press 8 ÷ 2 =
    fireEvent.click(screen.getByText('8'));
    fireEvent.click(screen.getByLabelText('÷'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByLabelText('='));
    
    // The result should be 4
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  test('handles decimal numbers correctly', () => {
    // Press 1 . 5 + 2 . 5 =
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByLabelText('.'));
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByLabelText('+'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByLabelText('.'));
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByLabelText('='));
    
    // The result should be 4
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  test('chains operations correctly', () => {
    // Press 3 × 3 × 3 =
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByLabelText('×'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByLabelText('×'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByLabelText('='));
    
    // The result should be 27
    expect(screen.getByText('27')).toBeInTheDocument();
  });

  test('clears the calculator correctly', () => {
    // Enter some numbers and operations
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByLabelText('+'));
    fireEvent.click(screen.getByText('7'));
    
    // Clear the calculator
    fireEvent.click(screen.getByText('Clear'));
    
    // The display should be 0
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('handles division by zero', () => {
    // Press 8 ÷ 0 =
    fireEvent.click(screen.getByText('8'));
    fireEvent.click(screen.getByLabelText('÷'));
    fireEvent.click(screen.getByText('0'));
    fireEvent.click(screen.getByLabelText('='));
    
    // The result should be "Error"
    expect(screen.getByText('Error')).toBeInTheDocument();
  });
  
  test('responds to number keyboard inputs', () => {
    // Simulate keyboard press for '5'
    fireEvent.keyDown(document, { key: '5' });
    expect(screen.getByText('5')).toBeInTheDocument();
  });
  
  test('responds to decimal point keyboard input', () => {
    fireEvent.keyDown(document, { key: '1' });
    fireEvent.keyDown(document, { key: '.' });
    expect(screen.getByText('1.')).toBeInTheDocument();
  });
  
  test('responds to operation keyboard inputs', () => {
    fireEvent.keyDown(document, { key: '7' });
    fireEvent.keyDown(document, { key: '+' });
    fireEvent.keyDown(document, { key: '3' });
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(screen.getByText('10')).toBeInTheDocument();
  });
  
  test('clears with Escape key', () => {
    fireEvent.keyDown(document, { key: '9' });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('clears with Delete key', () => {
    fireEvent.keyDown(document, { key: '9' });
    fireEvent.keyDown(document, { key: 'Delete' });
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('clears with Backspace key', () => {
    fireEvent.keyDown(document, { key: '9' });
    fireEvent.keyDown(document, { key: 'Backspace' });
    expect(screen.getByText('0')).toBeInTheDocument();
  });
  
  test('supports undo operation', () => {
    // Perform a calculation
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByLabelText('+'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByLabelText('='));
    expect(screen.getByText('8')).toBeInTheDocument();
    
    // Undo the calculation
    fireEvent.click(screen.getByText('Undo'));
    
    // Should show the state before the equals was pressed
    expect(screen.getByText('3')).toBeInTheDocument();
  });
  
  test('supports Control+Z for undo', () => {
    // Perform a calculation
    fireEvent.click(screen.getByText('7'));
    fireEvent.click(screen.getByLabelText('-'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByLabelText('='));
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // Undo with Ctrl+Z
    fireEvent.keyDown(document, { key: 'z', ctrlKey: true });
    
    // Should show the state before the equals was pressed
    expect(screen.getByText('2')).toBeInTheDocument();
  });
  
  test('supports negative number input', () => {
    // Press minus for negative input
    fireEvent.click(screen.getByLabelText('-'));
    fireEvent.click(screen.getByText('5'));
    expect(screen.getByText('-5')).toBeInTheDocument();
    
    // Press minus again to switch to positive
    fireEvent.click(screen.getByLabelText('-'));
    expect(screen.getByText('5')).toBeInTheDocument();
  });
  
  test('supports negative number in operation', () => {
    fireEvent.click(screen.getByText('8'));
    fireEvent.click(screen.getByLabelText('+'));
    fireEvent.click(screen.getByLabelText('-'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByLabelText('='));
    expect(screen.getByText('5')).toBeInTheDocument();
  });
