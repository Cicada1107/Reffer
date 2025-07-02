import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function GET(
    request: NextRequest,
    {params}: {params: Promise<{userId: string}>}
){
    try{
        //user auth verification
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const {userId} = await params;

        //Hit the db for gtting the public profile (insensitive) info now
        const userProfile = await prisma.user.findUnique({
        where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                college: true,
                branch: true,
                degree: true,
                company: true,
                role: true,
                linkedin: true,
                resumeUrl: true,
                createdAt: true,
            }
        });

        if (!userProfile) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(userProfile);
    }catch(err){
        console.error('Error fetching public user profile:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}