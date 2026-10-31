
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = 'nodejs';

async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error(`Le fichier "${file.name}" n'est pas une image.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const result: UploadApiResponse = await new Promise(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: 'image', folder: 'lafille-ci' },
          (error, result) => {
            if (error) reject(error);
            else if (!result) {
              reject(new Error('Cloudinary n’a retourné aucun résultat.'));
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    }
  );

  return result.secure_url;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const files = [
      ...formData.getAll('images'),
      ...formData.getAll('image'),
    ].filter((item): item is File => item instanceof File);

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'Sélectionne au moins une image.' },
        { status: 400 }
      );
    }

    const imageUrls = await Promise.all(files.map(uploadImage));

    return NextResponse.json(
      {
        imageUrl: imageUrls[0],
        imageUrls,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to upload images:', error);

    return NextResponse.json(
      { error: 'Échec du téléversement des images.' },
      { status: 500 }
    );
  }
}
