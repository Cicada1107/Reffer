'use client'

import UserDetails from "@/components/user_details";
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-black">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full mt-15 min-h-screen flex flex-col items-center p-3 bg-black">
      <UserDetails user={session?.user} />
    </div>
  );
}