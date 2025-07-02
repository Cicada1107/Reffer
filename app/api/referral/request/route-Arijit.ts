import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { referrerId, jobId, message } = await request.json();
    const requesterId = session.user.id;

    if (!referrerId) {
      return NextResponse.json({ error: 'Referrer ID is required' }, { status: 400 });
    }

    const existingRequest = await prisma.referralRequest.findFirst({
      where: {
        requesterId: requesterId,
        employeeId: referrerId,
        jobID: jobId,
        status: 'PENDING'
      }
    });

    if (existingRequest) {
      return NextResponse.json({ error: 'You have already sent a request to this user for this job' }, { status: 400 });
    }

    //DB - create a new ReferralRequest & corresponding chat object in the db, and link the chat
    const referralRequest = await prisma.referralRequest.create({
      data: {
        requesterId: requesterId,
        employeeId: referrerId,
        jobID: jobId,
        status: 'PENDING',
      }
    });

    const referralChat = await prisma.chat.create({
      data: {
        referralRequestId: referralRequest.id,
        isActive: true,
      }
    });

    if(message){
      await prisma.message.create({
        data: {
          chatId: referralChat.id,
          senderId: requesterId,
          receiverId: referrerId,
          content: message,
        }
      });
    }

    //create the chat session between user and employee, without opening it up, but make it reflect in the profile page, and accessible using the "chat" icon button in the user-card
    //Automatically send the "message", "jobId", "profile link"
    
    return NextResponse.json({
       success: true,
       data: {
        referralRequestId: referralRequest.id,
        chatId: referralChat.id,
       }
    });
  } catch (error) {
    console.error('Error creating referral request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}