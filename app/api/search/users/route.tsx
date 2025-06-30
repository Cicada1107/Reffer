import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const company = searchParams.get('company');
    const role = searchParams.get('role');
    const jobId = searchParams.get('jobId');

    if (!company || !role) {
      return NextResponse.json({ error: 'Company and role are required' }, { status: 400 });
    }

    // Search for users with matching company and role
    // Exclude the current user from results
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            company: {
              contains: company,
              mode: 'insensitive'
            }
          },
          {
            role: {
              contains: role,
              mode: 'insensitive'
            }
          },
          {
            NOT: {
              email: session.user.email
            }
          },
          // Only include users who have both company and role filled
          {
            company: {
              not: null
            }
          },
          {
            role: {
              not: null
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        company: true,
        role: true,
        college: true,
        branch: true,
        linkedin: true
      },
      take: 50 // Limit results
    });

    return NextResponse.json({ 
      users,
      searchParams: { company, role, jobId }
    });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}