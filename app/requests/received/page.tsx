'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileImage from "@/components/ui/profile-image";

interface ReceivedRequest {
  id: string;
  status: string;
  createdAt: string;
  requester: {
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

export default function userReceivedRequests() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [requests, setRequests] = useState<ReceivedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReceivedRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/requests/received?userId=${session?.user?.id}`);

      if (!response.ok) throw new Error('Failed to fetch received Requests');

      const data = await response.json();
      setRequests(data.receivedRequests || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      signIn('google');
      return;
    }

    fetchReceivedRequests();
  }, [session, status, router]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 ring-yellow-400/30';
      case 'concluded':
        return 'text-green-400 bg-green-400/10 ring-green-400/30';
      default:
        return 'text-white bg-white/10 ring-white/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="w-full min-h-screen bg-black pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Skeleton className="h-8 w-64" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
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
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-scree pt-20 pb-8 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-purple-900/20 before:via-transparent before:to-purple-800/10 before:pointer-events-none">
        <div className="text-center">
          <h2 className="text-white text-xl mb-2">Error Loading Requests</h2>
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchReceivedRequests}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-20 pb-8 bg-gradient-to-br from-black via-gray-900 to-black relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-purple-900/20 before:via-transparent before:to-purple-800/10 before:pointer-events-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Received Requests</h1>
          <p className="text-white/60">Referral requests you've received from other users</p>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
              </svg>
            </div>
            <h3 className="text-white text-lg mb-2">No Received Requests</h3>
            <p className="text-white/60">You haven't received any referral requests yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-5 py-4 hover:bg-white/10 transition-all duration-200 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  {/* Left: Avatar + Info */}
                  <div className="flex gap-4 items-start flex-1">
                    <ProfileImage
                      src={request.requester.image}
                      alt={request.requester.name}
                      className="w-12 h-12 rounded-full border border-white/20 object-cover"
                    />

                    <div className="flex flex-col text-white space-y-0.5">
                      <div className="text-base font-semibold">{request.requester.name}</div>
                      <div className="text-sm text-white/70">{request.requester.email}</div>
                      {request.requester.company && (
                        <div className="text-sm text-white/80">
                          {request.requester.role} at {request.requester.company}
                        </div>
                      )}
                      {request.requester.college && (
                        <div className="text-xs text-white/60">{request.requester.college}</div>
                      )}
                      <div className="text-xs text-white/40 mt-1">
                        Requested on {formatDate(request.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Right: Status + Chat */}
                  <div className="flex flex-col items-end shrink-0 gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ring-1 ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>

                    {request.chat && (
                      <button
                        //@ts-ignore
                        onClick={() => router.push(`/chat/${request.chat.id}`)}
                        className="text-sm border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors px-3 py-1 rounded-lg"
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
  );
}
