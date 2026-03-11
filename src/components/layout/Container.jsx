import React from 'react';

const Container = ({ children }) => {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </div>
    </main>
  );
};

export default Container;