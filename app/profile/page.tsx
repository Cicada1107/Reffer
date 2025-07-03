'use client'

import UserDetails from "@/components/user_details";
import { Skeleton } from "@/components/ui/skeleton"
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import UserRequests from "@/components/user_requests";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      signIn('google');
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-black px-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px] sm:w-[250px]" />
            <Skeleton className="h-4 w-[150px] sm:w-[200px]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="flex flex-col space-y-6 lg:space-y-8">
          {session?.user && <UserDetails user={session.user} />}
          <UserRequests />
        </div>
      </div>
    </div>
  );
}