import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { 
  PhoneIcon, MailIcon, UsersIcon, PlusIcon, SearchIcon, 
  BellIcon, CheckCircleIcon, LogOutIcon 
} from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import {
  getOutgoingFriendReqs,
  getFriendRequests,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  logout
} from "../lib/api";

const Layout = ({ children }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { data: friendRequestsData, isLoading: loadingIncoming } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });
  const incomingReqs = friendRequestsData?.incomingReqs || [];

  const { mutate: sendRequestMutation } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  const { mutate: acceptMutation, isPending: isAccepting } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomingFriendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const { mutate: rejectMutation, isPending: isRejecting } = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomingFriendReqs"] });
    },
  });

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
      window.location.reload();
    }
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // If we're not authenticated, don't try to render the shell
  if (!authUser) return <div className="min-h-screen bg-white">{children}</div>;

  return (
    <div className="flex h-screen bg-white text-gray-800 font-sans overflow-hidden border-t-4 border-[#7c3aed]">
      {/* LEFT COLUMN: NAVIGATION & CHATS */}
      <div className="w-[320px] lg:w-[350px] border-r border-gray-100 flex flex-col bg-white shrink-0">
        
        {/* Top Mini Nav */}
        <div className="flex items-center justify-between p-4 border-b border-gray-50 border-dashed">
          <div className="relative">
             <Link to="/">
               <img 
                 src="/Screenshot_2026-04-21_001617-removebg-preview.png" 
                 alt="Lumina" 
                 className="h-10 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform" 
               />
               <div className="absolute top-0 -right-1 size-2.5 bg-red-500 rounded-full border-2 border-white"></div>
             </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-600 transition-colors"><PhoneIcon className="size-4" /></button>
            <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
               <MailIcon className="size-4" />
               <div className="absolute top-0 right-0 size-1.5 bg-red-500 rounded-full"></div>
            </button>
            <button className="text-gray-400 hover:text-gray-600 transition-colors"><UsersIcon className="size-4" /></button>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => logoutMutation()} 
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Log out"
            >
              <LogOutIcon className="size-4" />
            </button>
            <Link to="/profile" className="avatar">
              <div className="w-8 rounded-full ring-2 ring-gray-100 overflow-hidden relative hover:ring-purple-200 transition-all">
                <img src={authUser.profilePic || "/avatar.png"} alt="User" />
              </div>
            </Link>
          </div>
        </div>

        {/* Chats Header */}
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Chats</h1>
            <button className="size-7 bg-[#7c3aed] text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
              <PlusIcon className="size-4" />
            </button>
          </div>
          
          <div className="flex gap-4 text-[10px] font-extrabold text-gray-300 mb-6">
            <button className="text-gray-900 flex items-center gap-1">DIRECT <span className="text-red-500 text-lg leading-none">*</span></button>
            <button className="hover:text-gray-600 flex items-center gap-1">GROUPS <span className="text-red-500 text-lg leading-none opacity-50">*</span></button>
            <button className="hover:text-gray-600 flex items-center gap-1">PUBLIC <span className="text-red-500 text-lg leading-none opacity-50">*</span></button>
          </div>

          <div className="relative mb-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon className="size-4" />
            </span>
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-white border border-gray-100 shadow-sm rounded-full py-2.5 pl-11 pr-4 text-xs focus:ring-1 focus:ring-purple-200 outline-none"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
          {loadingFriends ? (
            <div className="flex justify-center py-10"><span className="loading loading-spinner text-purple-500 size-6" /></div>
          ) : friends.length === 0 ? (
            <p className="text-center text-xs text-gray-400 pt-10">No chats yet</p>
          ) : (
            friends.map((friend) => {
              const isActive = location.pathname === `/chat/${friend._id}`;
              return (
                <Link
                  key={friend._id}
                  to={`/chat/${friend._id}`}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                    isActive 
                      ? "bg-[#1f2937] text-white shadow-lg" 
                      : "hover:bg-gray-50 text-gray-800"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img src={friend.profilePic} className="size-11 rounded-full object-cover" alt="" />
                    <div className="absolute bottom-0 right-0 size-3 border-2 border-white bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className={`font-bold text-sm truncate ${isActive ? "text-white" : "text-gray-900"}`}>{friend.fullName}</h3>
                      <span className={`text-[9px] font-bold ${isActive ? "text-gray-400" : "text-purple-500"}`}>2:34 PM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {isActive && <CheckCircleIcon className="size-3 text-gray-400" />}
                      <p className={`text-[11px] truncate ${isActive ? "text-gray-400" : "text-gray-500"}`}>
                        {friend.bio || "Are you there ??"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* MIDDLE COLUMN: THE ACTIVE CONTENT */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
         {children}
      </div>

      {/* RIGHT COLUMN: NOTIFICATIONS & SUGGESTIONS */}
      <div className="w-[280px] xl:w-[320px] border-l border-gray-100 border-dashed bg-white hidden lg:flex flex-col p-6 overflow-y-auto shrink-0">
        
        <h2 className="text-lg font-bold text-gray-900 mb-6">Notifications</h2>
        
        <div className="space-y-5 mb-10">
           {loadingIncoming ? (
             <div className="flex justify-center"><span className="loading loading-spinner text-purple-500 size-4"></span></div>
           ) : incomingReqs.length === 0 ? (
             <p className="text-[10px] text-gray-400 font-medium">No new notifications</p>
           ) : (
             incomingReqs.map((req) => (
               <div key={req._id} className="flex gap-3 items-start group">
                 <img src={req.sender.profilePic || "/avatar.png"} className="size-8 rounded-full border border-gray-100 object-cover shrink-0" />
                 <div className="min-w-0 text-left flex-1">
                   <p className="text-xs text-gray-700 leading-tight">
                     <span className="font-bold text-[#7c3aed]">@{req.sender.fullName.split(' ')[0]}</span> wants to connect with you.
                   </p>
                   <div className="flex items-center gap-2 mt-2">
                     <button 
                       onClick={() => acceptMutation(req._id)}
                       disabled={isAccepting}
                       className="px-3 py-1 bg-[#25D366] text-white text-[10px] font-bold rounded-full shadow-sm hover:scale-105 transition-transform disabled:opacity-50"
                     >
                       Accept
                     </button>
                     <button 
                       onClick={() => rejectMutation(req._id)}
                       disabled={isRejecting}
                       className="px-3 py-1 bg-red-100 text-red-600 hover:bg-red-200 text-[10px] font-bold rounded-full transition-colors disabled:opacity-50"
                     >
                       Decline
                     </button>
                   </div>
                 </div>
               </div>
             ))
           )}
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-6">Suggestions</h2>
        <div className="space-y-5">
          {recommendedUsers.slice(0, 4).map(user => (
            <div key={`sugg-${user._id}`} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <img src={user.profilePic} className="size-9 rounded-full object-cover border border-gray-100" alt="" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{user.fullName}</p>
                  <p className="text-[9px] text-gray-400">12 Mutuals</p>
                </div>
              </div>
              <button 
                onClick={() => sendRequestMutation(user._id)}
                className="px-4 py-1.5 bg-[#a78bfa] hover:bg-[#7c3aed] text-white text-[10px] font-bold rounded-full shadow-sm transition-colors"
                disabled={outgoingRequestsIds.has(user._id)}
              >
                {outgoingRequestsIds.has(user._id) ? "Sent" : "Add"}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Layout;
