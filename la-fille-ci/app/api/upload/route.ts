import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'lafille-ci' },
        (error, result) => {
          if (error) reject(error);
          else if (!result) reject(new Error('No result from Cloudinary'));
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ imageUrl: result.secure_url }, { status: 201 });
  } catch (error) {
    console.error('Failed to upload image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
