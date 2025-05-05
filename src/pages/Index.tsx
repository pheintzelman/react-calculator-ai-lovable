
import React from 'react';
import Calculator from '@/components/Calculator';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Simple Calculator</h1>
      <Calculator />
      <p className="mt-8 text-gray-500 text-sm">
        Use the calculator to perform basic arithmetic operations
      </p>
    </div>
  );
};

export default Index;
