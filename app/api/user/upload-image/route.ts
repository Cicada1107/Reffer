import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing file or user ID' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    //uploading to cloudinary using a promisified version of its by-default-callback-based upload_stream method 
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'avatars',
          public_id: `${userId}-${Date.now()}`,
          transformation: [
            {
              width: 400,
              height: 400,
              crop: 'fill'
            }
          ]
        },
        (error, result) => {
          if(error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    })

    const imageUrl = (uploadResult as any).secure_url;

    //Now gotta save this url to the db hehe
    //hey fellow coder reading my code this took me some time to crack so I'm happy
    await prisma.user.update({
      where: {id: userId},
      data: {
        image: imageUrl
      }
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}