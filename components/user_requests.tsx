'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { CheckCircle, Clock, MessageCircle, User } from "lucide-react";
import { Button } from "./ui/button";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  company?: string;
  role?: string;
  college?: string;
}

interface ReferralRequestWithUser {
  id: string;
  jobID: string;
  status: 'PENDING' | 'CONCLUDED';
  createdAt: string;
  employee: UserProfile;
  chat: {
    id: string;
  };
}

export default function UserRequests() {
  const { data: session } = useSession();
  const router = useRouter();
  
  //states
  const [requests, setRequests] = useState<ReferralRequestWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  //query the db to get all the requests of the user
  useEffect(() => {
    const fetchUserRequests = async () => {
      if(!session?.user?.id) return;

      try{
        const response = await fetch(`/api/user/requests?userId=${session.user.id}`);
        if(response.ok){
          const data = await response.json();
          console.log("Received referral Request data: ", data); //debug
          setRequests(data.requests || []);
        }else{
          console.error('Failed to fetch user requests: ', response.status, response.statusText);
          const errorData = await response.json();
          console.error('Error details:', errorData);
        }
      }catch(err){
        console.error('Error fetching user requests: ', err);
      }finally{
        setLoading(false);
      }
    }
    
    fetchUserRequests();
  }, [session?.user?.id]);

  //Segragating into pending and concluded requests
  const pendingRequests = requests.filter(req => req.status === 'PENDING');
  const concludedRequests = requests.filter(req => req.status === 'CONCLUDED');

  //Create the hnadler to take the user to the corresponding chat when the user card is clicked
  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  //handler for taking user to the profile of the user if he clicks the image
  const handleProfileClick = (userId: string) => {
    router.push(`/user/${userId}`)
  };

  //The UI now
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-6">
          <Skeleton className="h-6 w-[150px] sm:w-[200px] mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full max-w-[120px]" />
                    <Skeleton className="h-3 w-full max-w-[100px]" />
                  </div>
                </div>
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  //define a re-usable user-card component right here (we can't use the old one (search vala) because it has diff logic)
  const RequestCard = ({ request }: { request: ReferralRequestWithUser }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 group">
      {/* Profile Section */}
      <div className="flex items-center space-x-3 mb-4">
        <div 
          className="relative group cursor-pointer flex-shrink-0"
          onClick={() => handleProfileClick(request.employee.id)}
          title="View profile"
        >
          <img
            src={request.employee.image || '/default-avatar.png'}
            alt={request.employee.name}
            className="w-12 h-12 rounded-full border-2 border-white/20 hover:border-purple-500/50 transition-colors"
          />
          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{request.employee.name}</h3>
          <p className="text-xs text-gray-400 truncate">{request.employee.email}</p>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-2 mb-4">
        {request.employee.company && (
          <div className="flex flex-col sm:flex-row sm:items-center text-gray-300 text-xs">
            <span className="font-medium">{request.employee.company}</span>
            {request.employee.role && (
              <span className="sm:ml-1 text-gray-400">
                <span className="hidden sm:inline">• </span>
                {request.employee.role}
              </span>
            )}
          </div>
        )}
        
        {request.jobID && (
          <div className="text-xs text-gray-400">
            Job ID: <span className="font-mono break-all">{request.jobID}</span>
          </div>
        )}

        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">{new Date(request.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Status Badge and Chat Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium self-start ${
          request.status === 'PENDING' 
            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
            : 'bg-green-500/20 text-green-400 border border-green-500/30'
        }`}>
          {request.status === 'PENDING' ? (
            <>
              <Clock className="w-3 h-3 mr-1" />
              Pending
            </>
          ) : (
            <>
              <CheckCircle className="w-3 h-3 mr-1" />
              Concluded
            </>
          )}
        </div>

        {/* Chat Button */}
        <Button
          onClick={() => handleChatClick(request.chat.id)}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 h-8 w-full sm:w-auto"
          title="Open chat"
        >
          <MessageCircle className="w-3 h-3 mr-1" />
          Chat
        </Button>
      </div>
    </div>
  );

  //Now the UI - reflecting the two sections
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Pending Requests Section */}
      <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center mb-6 space-y-2 sm:space-y-0">
          <div className="flex items-center">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mr-3" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">Pending Requests</h2>
          </div>
          <span className="ml-0 sm:ml-3 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-sm font-medium self-start">
            {pendingRequests.length}
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-base sm:text-lg">No pending requests</p>
            <p className="text-gray-500 text-sm">Your pending referral requests will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>

      {/* Concluded Requests Section */}
      <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center mb-6 space-y-2 sm:space-y-0">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-3" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">Concluded Requests</h2>
          </div>
          <span className="ml-0 sm:ml-3 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm font-medium self-start">
            {concludedRequests.length}
          </span>
        </div>

        {concludedRequests.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-base sm:text-lg">No concluded requests</p>
            <p className="text-gray-500 text-sm">Your concluded referral requests will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {concludedRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}