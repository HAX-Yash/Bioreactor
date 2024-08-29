import React, { useState } from 'react';
import Image from 'next/image'; // Use Next.js Image component
import haxlogo1 from '@/components/haxlogo1.png'; // Import the logo image
import ToggleButton from '@/components/ToggleButton'; // Import the ToggleButton component
import Sidebar from '@/components/Sidebar'; // Import the Sidebar component

interface NavbarProps {
  onSyncStateChange: (stateKey: 'syncState' | 'motorState' | 'reverseDirection', state: boolean) => void;
  onReactorChange: (reactor: string) => void; // Add this prop
}

const Navbar: React.FC<NavbarProps> = ({ onSyncStateChange, onReactorChange }) => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const handleStateChange = (stateKey: 'motorState' | 'reverseDirection' | 'syncState', state: boolean) => {
    console.log(`State changed for ${stateKey}: ${state}`);
    onSyncStateChange(stateKey, state); // Call the passed handler
  };

  return (
    <nav className="bg-[#00308F] p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Using the Image component */}
        <Image src={haxlogo1} alt="Logo" width={100} height={100} className="h-34" />

        {/* ToggleButton used for sync state */}
        <ToggleButton
          label="SYNC Systems"
          postEndpoint="http://localhost:3001/post_dashboard_data_2"
          system="System2" // Adjust system as needed
          stateKey="syncState" // Key for sync state
          onStateChange={handleStateChange}
        />

        {/* Menu button to open the sidebar */}
        <button
          className="text-white text-2xl"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>

        {/* Sidebar component */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onReactorChange={onReactorChange} // Pass the callback
        />
      </div>
    </nav>
  );
};

export default Navbar;
