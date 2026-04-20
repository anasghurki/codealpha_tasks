import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import Whiteboard from "../components/Whiteboard";
import { InfoIcon } from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// Custom Header matching the image
const CustomChannelHeader = ({ channel, handleVideoCall, authUser, onOpenWhiteboard, targetUserId }) => {
  // Pull real profile data from cached friends list (bypassing stream chat limits)
  const { data: friends = [] } = useQuery({ queryKey: ["friends"] });
  const actualUser = friends.find((f) => f._id === targetUserId);
  
  const userImage = actualUser?.profilePic || "/avatar.png";
  const userName = actualUser?.fullName || "User";

  return (
    <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white h-[80px]">
      <div className="flex items-center gap-4">
         <div className="relative">
           <img 
             src={userImage} 
             onError={(e) => { 
               if (!e.target.dataset.errorHandled) {
                 e.target.dataset.errorHandled = true;
                 e.target.src = "/avatar.png"; 
               }
             }}
             className="size-11 rounded-full object-cover" 
             alt=""
           />
           <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white rounded-full"></div>
         </div>
         <div>
           <h2 className="text-[1.1rem] font-bold text-gray-900 leading-tight">
             {userName}
           </h2>
           <p className="text-xs text-gray-400 font-medium mt-0.5">Last seen recently</p>
         </div>
      </div>
      
      <div className="flex items-center gap-5">
         <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
         </button>

         {/* Whiteboard Button */}
         <button onClick={onOpenWhiteboard} className="text-gray-400 hover:text-[#0d9488] transition-colors" title="Open Collaborative Whiteboard">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
         </button>

         <button onClick={handleVideoCall} className="text-gray-400 hover:text-[#7c3aed] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
         </button>
         <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
         </button>
      </div>
    </div>
  );
};

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
      if (!STREAM_API_KEY) {
        console.error("VITE_STREAM_API_KEY is missing from frontend .env");
        setLoading(false);
        return;
      }

      if (!tokenData?.token || !authUser || !targetUserId) {
        if (tokenData && !tokenData.token) setLoading(false);
        return;
      }

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error(`Chat connection error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  const handleWhiteboardSend = async (dataUrl) => {
    if (channel) {
      try {
        await channel.sendMessage({
          text: "I shared a new drawing from the Whiteboard! 🎨",
          attachments: [
            {
              type: "image",
              image_url: dataUrl,
              fallback: "Whiteboard Drawing",
            }
          ]
        });
        toast.success("Whiteboard drawing sent successfully!");
        setIsWhiteboardOpen(false);
      } catch (error) {
        console.error("Failed to send whiteboard:", error);
        toast.error("Failed to send drawing. It might be too large.");
      }
    }
  };

  if (loading) return <ChatLoader />;

  if (!chatClient || !channel) {
    return (
      <div className="flex flex-col items-center justify-center h-[90vh] bg-[#F0F2F5] p-6 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md border border-gray-100">
          <div className="size-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <InfoIcon className="size-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Chat Connection Failed</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            We couldn't establish a secure connection to the chat servers.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5c] text-white font-bold rounded-2xl shadow-lg transition-all transform active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white relative">
      <Chat client={chatClient} theme="messaging light">
        <Channel channel={channel}>
          <Window>
            <div className="relative h-full flex flex-col">
              <CustomChannelHeader 
                channel={channel} 
                handleVideoCall={handleVideoCall} 
                authUser={authUser} 
                targetUserId={targetUserId}
                onOpenWhiteboard={() => setIsWhiteboardOpen(true)} 
              />
              <div className="flex-1 overflow-hidden">
                <MessageList />
              </div>
              <MessageInput focus />
            </div>
          </Window>
          <Thread />
        </Channel>
      </Chat>

      {isWhiteboardOpen && (
        <Whiteboard 
          onClose={() => setIsWhiteboardOpen(false)} 
          onSend={handleWhiteboardSend}
        />
      )}
    </div>
  );
};
export default ChatPage;
