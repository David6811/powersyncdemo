"use client"; // This line indicates that this is a client component
import dynamic from "next/dynamic";

// Dynamically import PowerSync with SSR disabled
const PowerSync = dynamic(() => import("../components/PowerSync"), { ssr: false });

const App: React.FC = () => {
  return (
    <div>
      <PowerSync />
    </div>
  );
};

export default App;
