import { Link } from "react-router";

const HomePage = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white">
      <div className="text-center space-y-4 opacity-50">
        <img 
          src="/Screenshot_2026-04-21_001617-removebg-preview.png" 
          alt="Lumina" 
          className="size-24 mx-auto object-contain grayscale opacity-30" 
        />
        <h2 className="text-2xl font-bold text-gray-400">Welcome to Lumina Chat</h2>
        <p className="text-sm text-gray-400">Select a conversation from the left to start messaging</p>
      </div>
    </div>
  );
};

export default HomePage;
