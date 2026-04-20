import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-6 sm:p-8 lg:p-10 bg-[#F8F9FA] min-h-screen">
      <div className="container mx-auto max-w-4xl space-y-10">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated with your latest connections and requests</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-[#25D366]"></span>
          </div>
        ) : (
          <div className="space-y-12">
            {incomingRequests.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-[#E7FCE3] rounded-lg">
                    <UserCheckIcon className="h-5 w-5 text-[#075E54]" />
                  </div>
                  Incoming Requests
                  <span className="bg-[#25D366] text-white text-xs font-bold px-2 py-0.5 rounded-full">{incomingRequests.length}</span>
                </h2>

                <div className="grid gap-4">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="avatar size-16 rounded-2xl overflow-hidden ring-4 ring-gray-50">
                          <img src={request.sender.profilePic} alt={request.sender.fullName} className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg">{request.sender.fullName}</h3>
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            <span className="px-2.5 py-0.5 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-full uppercase border border-gray-100">
                              Native: {request.sender.nativeLanguage}
                            </span>
                            <span className="px-2.5 py-0.5 bg-[#E7FCE3] text-[#075E54] text-[10px] font-bold rounded-full uppercase">
                              Learning: {request.sender.learningLanguage}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        className="w-full sm:w-auto px-8 py-2.5 bg-[#25D366] hover:bg-[#20bd5c] text-white font-bold rounded-xl shadow-sm transition-all transform active:scale-95 disabled:opacity-50"
                        onClick={() => acceptRequestMutation(request._id)}
                        disabled={isPending}
                      >
                        Accept
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BellIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  New Connections
                </h2>

                <div className="grid gap-4">
                  {acceptedRequests.map((notification) => (
                    <div key={notification._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                      <div className="avatar size-12 rounded-full overflow-hidden ring-2 ring-gray-50">
                        <img
                          src={notification.recipient.profilePic}
                          alt={notification.recipient.fullName}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900">{notification.recipient.fullName}</h3>
                        <p className="text-sm text-gray-600">
                          {notification.recipient.fullName} accepted your friend request
                        </p>
                        <p className="text-[10px] flex items-center text-gray-400 mt-1 uppercase font-bold tracking-tighter">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          Recently
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-green-50 text-[#25D366] text-[10px] font-extrabold rounded-full border border-green-100 uppercase">
                        <MessageSquareIcon className="h-3 w-3" />
                        Connected
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                <NoNotificationsFound />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;
