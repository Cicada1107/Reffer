import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Replace with actual database query
    const userProfile = {
      phone: '+1234567890',
      college: 'Sample University',
      branch: 'Computer Science',
      degree: 'Bachelor of Technology',
      company: 'Tech Corp',
      role: 'Software Engineer',
      linkedin: 'https://linkedin.com/in/user',
      resumeUrl: null
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, phone, college, branch, degree, company, role, linkedin, resumeUrl } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Verify the user can only update their own profile
    //@ts-ignore
    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Replace with actual database update
    const updatedProfile = {
      id: userId,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      phone,
      college,
      branch,
      degree,
      company,
      role,
      linkedin,
      resumeUrl
    };

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}