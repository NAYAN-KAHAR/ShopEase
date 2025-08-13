import { v2 as cloudinary } from 'cloudinary';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import os from 'os';
import { NextResponse } from 'next/server';

// 🔧 Cloudinary config
cloudinary.config({
  cloud_name: 'dx0qmwrrz',
  api_key: '849214223577591',
  api_secret: '_sIKa0UtNClm2FkdLztVkykr6XU',
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const uploadResults = [];
    const filesToUpload = [];

    // Collect all valid files first
    for (let i = 1; i <= 4; i++) {
      const file = formData.get(`image${i}`);
      if (file && typeof file !== 'string') {
        filesToUpload.push({ file, index: i });
      }
    }

    // Validation: at least 2 images required
    if (filesToUpload.length < 2) {
      return NextResponse.json(
        { error: 'Please upload at least 2 images' },
        { status: 400 }
      );
    }

    // Upload all valid files
    for (const { file, index } of filesToUpload) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const tempPath = path.join(os.tmpdir(), file.name);
      await writeFile(tempPath, buffer);

      const result = await cloudinary.uploader.upload(tempPath, {
        folder: 'uploads',
      });

      await unlink(tempPath);
      uploadResults.push({ index, url: result.secure_url });
    }

    return NextResponse.json({ message: 'Images uploaded', results: uploadResults });

  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}




// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get('image');

//     // ❌ Handle invalid file
//     if (!file || typeof file === 'string') {
//       return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
//     }

//     // ✅ Save to temp file
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const tempPath = path.join(os.tmpdir(), file.name);
//     await writeFile(tempPath, buffer);

//     // ✅ Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(tempPath, {
//       folder: 'uploads', // optional folder name
//     });

//     // 🧹 Clean up local temp file
//     await unlink(tempPath);
//     return NextResponse.json({ message: 'Image uploaded', url: result.secure_url });

//   } catch (err) {
//     console.error('Upload error:', err);
//     return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
//   }
// }

/*
file.arrayBuffer() — reads the uploaded image into memory
Buffer.from() — turns that data into a Node.js Buffer
os.tmpdir() — gives you the system temp folder path (e.g., /tmp)
path.join() — builds the full path to the temp file
writeFile() — writes the file to disk

// ******************************************
export async function POST(req) {
  try {
    const formData = await req.formData();
    const uploadResults = [];
    const filesToUpload = [];

    // Collect all valid files first
    for (let i = 1; i <= 4; i++) {
      const file = formData.get(`image${i}`);
      if (file && typeof file !== 'string') {
        filesToUpload.push({ file, index: i });
      }
    }

    // Validation: at least 2 images required
    if (filesToUpload.length < 2) {
      return NextResponse.json(
        { error: 'Please upload at least 2 images' },
        { status: 400 }
      );
    }

    // Upload all valid files
    for (const { file, index } of filesToUpload) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const tempPath = path.join(os.tmpdir(), file.name);
      await writeFile(tempPath, buffer);

      const result = await cloudinary.uploader.upload(tempPath, {
        folder: 'uploads',
      });

      await unlink(tempPath);
      uploadResults.push({ index, url: result.secure_url });
    }

    return NextResponse.json({ message: 'Images uploaded', results: uploadResults });
*/