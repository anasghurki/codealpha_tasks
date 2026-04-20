import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  // const queryClient = useQueryClient();
  // const { mutate: logoutMutation } = useMutation({
  //   mutationFn: logout,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-30 h-16 flex items-center shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-end w-full gap-4">
          {/* LOGO - ONLY IN THE CHAT PAGE or for mobile? */}
          {isChatPage && (
            <div className="mr-auto">
              <Link to="/" className="flex items-center">
                <img 
                  src="/Screenshot_2026-04-21_001617-removebg-preview.png" 
                  alt="Lumina Chat Logo" 
                  className="h-10 w-auto object-contain" 
                />
              </Link>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle text-gray-500 hover:bg-gray-100">
                <BellIcon className="h-5 w-5" />
              </button>
            </Link>
            <ThemeSelector />
          </div>

          <div className="h-8 w-[1px] bg-gray-200 mx-2" />

          <Link to="/profile" className="flex items-center gap-3 hover:bg-gray-100 p-1.5 rounded-xl transition-colors group">
            <div className="avatar">
              <div className="w-10 rounded-full ring-2 ring-white group-hover:ring-[#7c3aed] transition-all">
                <img src={authUser?.profilePic || "/avatar.png"} alt="User Avatar" />
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-bold text-sm text-gray-800">{authUser?.fullName}</p>
              <p className="text-[10px] text-[#7c3aed] font-bold uppercase tracking-tighter">My Account</p>
            </div>
          </Link>

          {/* Logout button */}
          <button 
            className="btn btn-ghost btn-circle text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors" 
            onClick={logoutMutation}
            title="Logout"
          >
            <LogOutIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
