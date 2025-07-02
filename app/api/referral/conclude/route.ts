import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { referralRequestId } = await request.json();

    if (!referralRequestId) {
      return NextResponse.json({ error: 'Referral request ID is required' }, { status: 400 });
    }


    
    // Find the referral request and verify the user is a participant
    const referralRequest = await prisma.referralRequest.findUnique({
      where: {
        id: referralRequestId
      }
    });

    if (!referralRequest) {
      return NextResponse.json({ error: 'Referral request not found' }, { status: 404 });
    }



    // Check if the current user is either the requester or employee
    const userId = session.user.id;
    const isParticipant = (
      referralRequest.requesterId === userId || referralRequest.employeeId === userId
    );

    if (!isParticipant) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Update the status to CONCLUDED
    const updatedRequest = await prisma.referralRequest.update({
      where: {
        id: referralRequestId
      },
      data: {
        status: 'CONCLUDED'
      }
    });

    return NextResponse.json({ 
      success: true, 
      referralRequest: updatedRequest 
    });

  } catch (error) {
    console.error('Error concluding referral request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}