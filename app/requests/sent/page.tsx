//Just re use the /api/user/requests endpoint
'use client'

import { Skeleton } from "@/components/ui/skeleton";
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SentRequest {
  id: string;
  status: string;
  createdAt: string;
  employee: {
    id: string;
    name: string;
    email: string;
    image: string;
    company?: string;
    role?: string;
    college?: string;
  };
  chat?: {
    id: string;
  };
}


export default function userReceivedRequests(){
    const { data: session, status } = useSession();
    const router = useRouter();

    //states
    const [requests, setRequests] = useState<SentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    //defining the function and hitting the api endpoint to get the received requests
    const fetchSentRequests = async () => {
        try{
            setLoading(true);
            const response = await fetch(`/api/user/requests?userId=${session?.user?.id}`);

            if(!response.ok){
                throw new Error('Failed to fetch sent Requests');
            }

            const data = await response.json();
            setRequests(data.requests || []);
        }catch(err){
            setError(err instanceof Error? err.message : 'Something went wrong');
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        if(status === 'loading') return;
        if(!session){
            signIn('google');
            return;
        }

        fetchSentRequests();
    }, [session, status, router]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'concluded':
                return 'text-green-400 bg-green-400/10 border-green-400/20';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (status === "loading" || loading) {
        return (
        <div className="w-full min-h-screen bg-black pt-20 pb-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <Skeleton className="h-8 w-64" />
                    {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
                        <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-6 w-20" />
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="w-full min-h-screen bg-black pt-20 pb-8 flex items-center justify-center">
            <div className="text-center">
            <h2 className="text-white text-xl mb-2">Error Loading Requests</h2>
            <p className="text-red-400">{error}</p>
            <button 
                onClick={fetchSentRequests}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Try Again
            </button>
            </div>
        </div>
        );
    }

    return (
        // <RequestPageAnimation>
        <div className="w-full min-h-screen bg-black pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Sent Requests</h1>
            <p className="text-white/60">Referral requests you've sent to other users</p>
            </div>

            {requests.length === 0 ? (
            <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
                </svg>
                </div>
                <h3 className="text-white text-lg mb-2">No Sent Requests</h3>
                <p className="text-white/60">You haven't sent any referral requests yet.</p>
            </div>
            ) : (
            <div className="space-y-4">
                {requests.map((request) => (
                <div key={request.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors">
                    <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                        <img
                        src={request.employee.image || '/default-avatar.png'}
                        alt={request.employee.name}
                        className="w-12 h-12 rounded-full border-2 border-white/20"
                        />
                        <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">{request.employee.name}</h3>
                        <p className="text-white/60 text-sm">{request.employee.email}</p>
                        {request.employee.company && (
                            <p className="text-white/80 text-sm">
                            {request.employee.role} at {request.employee.company}
                            </p>
                        )}
                        {request.employee.college && (
                            <p className="text-white/60 text-xs">{request.employee.college}</p>
                        )}
                        <p className="text-white/40 text-xs mt-2">
                            Requested on {formatDate(request.createdAt)}
                        </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        
                        {request.chat && (
                        <button
                            onClick={() => router.push(`/chat/${request.chat.id}`)}
                            className="text-blue-400 hover:text-blue-300 text-sm underline"
                        >
                            View Chat
                        </button>
                        )}
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
        // </RequestPageAnimation>
    );
}