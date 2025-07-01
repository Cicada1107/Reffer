import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";


export async function GET(
    request: NextRequest,
    { params } : {params: Promise<{chatId: string}>}
){
    try{
        const session = await getServerSession(authOptions);

        if(!session?.user?.id){
            return NextResponse.json(
                {error: 'Unauthorized'},
                {status: 401}
            );
        }

        const { chatId } = await params;

        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId
            },
            include: {
                referralRequest: {
                    include: {
                        requester: true,
                        employee: true,
                    }
                },
                messages: {
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        });

        if(!chat){
            return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
        }

        //if someone other than the two people involved somehow guesses the chatId, bhai usko access deny karo
        const userId = session.user.id;
        const isParticipant = (
            chat.referralRequest.requesterId === userId || chat.referralRequest.employeeId === userId
        );
        if (!isParticipant) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        return NextResponse.json({
            chat,
            messages: chat.messages,
        })
    }catch(err){
        console.error('Error fetching chat: ', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}