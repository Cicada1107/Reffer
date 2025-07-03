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

        //verify that user can only seek those referralRequests which ther were a part of
        if (session.user.id !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        //query the db for those referralRequest objects which have the current user as the employee (user.id ==== employeeId)
        const receivedRequests = await prisma.referralRequest.findMany({
            where: {
                employeeId: userId
            },
            include: {
                requester: {
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
            receivedRequests
        });
    }catch(err){
        console.error("Error fetching user's received referral Requests: ", err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}