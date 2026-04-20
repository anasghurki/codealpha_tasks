import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-20 lg:w-24 bg-[#fcfcfd] border-r border-gray-100 hidden md:flex flex-col h-screen sticky top-0 z-40">
      <div className="py-8 flex flex-col items-center gap-10 h-full">
        <Link to="/" className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
          <img 
            src="/Screenshot_2026-04-21_001617-removebg-preview.png" 
            alt="Lumina" 
            className="size-8 object-contain" 
          />
        </Link>
  
        <nav className="flex-1 flex flex-col items-center gap-6">
          <Link
            to="/"
            className={`p-4 rounded-2xl transition-all duration-300 relative group ${
              currentPath === "/" 
                ? "bg-[#7c3aed] text-white shadow-lg shadow-purple-200" 
                : "text-gray-400 hover:bg-white hover:text-[#7c3aed]"
            }`}
            title="Chats"
          >
            <HomeIcon className="size-6" />
            {currentPath === "/" && (
              <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#7c3aed] rounded-l-full" />
            )}
          </Link>
  
          <Link
            to="/friends"
            className={`p-4 rounded-2xl transition-all duration-300 relative group ${
              currentPath === "/friends" 
                ? "bg-[#7c3aed] text-white shadow-lg shadow-purple-200" 
                : "text-gray-400 hover:bg-white hover:text-[#7c3aed]"
            }`}
            title="Contacts"
          >
            <UsersIcon className="size-6" />
          </Link>
  
          <Link
            to="/notifications"
            className={`p-4 rounded-2xl transition-all duration-300 relative group ${
              currentPath === "/notifications" 
                ? "bg-[#7c3aed] text-white shadow-lg shadow-purple-200" 
                : "text-gray-400 hover:bg-white hover:text-[#7c3aed]"
            }`}
            title="Notifications"
          >
            <BellIcon className="size-6" />
          </Link>
        </nav>
  
        <Link to="/profile" className="mt-auto mb-8 group">
          <div className="avatar">
            <div className="w-12 rounded-2xl ring-2 ring-transparent group-hover:ring-[#7c3aed] transition-all overflow-hidden bg-white shadow-sm">
              <img src={authUser?.profilePic || "/avatar.png"} alt="Me" />
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
};
export default Sidebar;
