'use client'
import { signIn, useSession } from "next-auth/react"
import { Button } from "./ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation";

export function Hero() {

    const { data: session, status } = useSession();
    const router = useRouter();

    const handleClick = () => {
        if(!session) signIn('google');
        else router.push("/profile");
        return;
    }

    return (
        <div className="pt-40 text-center space-y-5 max-w-2xl z-10">
            <p className="py-1 px-2 bg-zinc-900/40 backdrop-blur-sm font-light rounded-full text-white inline-block">Reffer</p>
            <div className="space-y-3 ">
                <h1 className="text-7xl tracking-tight bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-blue-500 text-transparent font-semibold">Get Referrals. Fast.</h1>
                <h3 className="text-xl tracking-tight bg-clip-text bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 text-transparent h-20 font-semibold">Save your time. And your sanity.</h3>
            </div>

            <p className="text-gray-400 text-lg text-pretty">
                Stop wasting your time running behind referrals. Invest it in upskilling. Leave the rest to us.
            </p>

            <div className="space-x-3">
                <Button variant="default" className="rounded-lg" onClick={handleClick}>Start Now</Button>
                <Link href="/search">
                    <Button variant="secondary" className="rounded-lg">Search Referrals</Button>
                </Link>
            </div>
        </div>
    )
}