import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/lib/prisma';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('resume') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing file or user ID' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB' }, { status: 400 });
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    //uploading to cloudinary using a promisified version of its by-default-callback-based upload_stream method 
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'resumes',
          public_id: `${userId}-resume-${Date.now()}`,
        },
        (error, result) => {
          if(error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    })

    const resumeUrl = (uploadResult as any).secure_url;

    //pushing the resume url to the db
    await prisma.user.update({
          where: {id: userId},
          data: {
            resumeUrl: resumeUrl
          }
        });

    return NextResponse.json({ resumeUrl });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}