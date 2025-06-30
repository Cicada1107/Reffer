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

    if (!referrerId) {
      return NextResponse.json({ error: 'Referrer ID is required' }, { status: 400 });
    }

    // You would create a referral request record here
    // This depends on your database schema for referral requests
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating referral request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}