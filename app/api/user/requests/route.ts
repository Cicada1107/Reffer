//endpoijnt for fetching all user requests (for profile page)

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest){
    try{
        const session = await getServerSession(authOptions);

        if(!session?.user?.id){
            return NextResponse.json({ error: 'Unauthorized' }, {status: 401});
        }

        const {searchParams} = new URL(request.url);
        const userId = searchParams.get('userId');

        if(!userId){
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        //verify that user can only seek their own referral requests
        if (session.user.id !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        //Now we query and get that juicy data
        const requests = await prisma.referralRequest.findMany({
            where: {
                requesterId: userId
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        company: true,
                        role: true,
                        college: true,
                    }
                },
                chat: {
                    select: {
                        id: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            requests
        });
    }catch(err){
        console.error("Error fetching User's referral Requests: ", err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}