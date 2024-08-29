import React, { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onReactorChange: (reactor: string) => void; // Add this prop
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onReactorChange }) => {
  const [selectedReactor, setSelectedReactor] = useState<string>('25L-bioreactor');

  const handleSelection = (reactor: string) => {
    setSelectedReactor(reactor);
    onReactorChange(reactor); // Call the new prop
    // Add any additional actions if needed when a reactor is selected
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-800 text-white transition-transform transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } w-1/6 shadow-lg z-50`}
    >
      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={onClose}
      >
        &times;
      </button>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Choose Reactor</h2>
        <ul>
          <li
            className={`mb-4 cursor-pointer text-lg py-2 px-4 text-center rounded-lg ${
              selectedReactor === '25L-bioreactor'
                ? 'bg-green-600 text-white'
                : 'bg-blue-500 hover:bg-blue-900 text-white'
            }`}
            onClick={() => handleSelection('25L-bioreactor')}
          >
            25 L Bioreactor
          </li>
          <li
            className={`mb-4 cursor-pointer text-lg py-2 px-4 text-center rounded-lg ${
              selectedReactor === '10L-bioreactor'
                ? 'bg-green-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            onClick={() => handleSelection('10L-bioreactor')}
          >
            10 L Bioreactor
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
