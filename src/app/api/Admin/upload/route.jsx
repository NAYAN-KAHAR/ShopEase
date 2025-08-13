import connectDB from '../../../../lib/mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import os from 'os';
import { NextResponse } from 'next/server';
import productModel from '../../../../models/productModel';

// Cloudinary config
cloudinary.config({
  cloud_name: 'dx0qmwrrz',
  api_key: '849214223577591',
  api_secret: '_sIKa0UtNClm2FkdLztVkykr6XU',
});

export async function POST(req) {
  try {
    const formData = await req.formData();

    const productName = formData.get('productName');
    const productDesc = formData.get('productDesc');
    const productPrice = Number(formData.get('productPrice'));
    const productOffer = Number(formData.get('productOffer'));
    const productCategory = formData.get('selectValue');
    const userId = formData.get('userId');
    
    const filesToUpload = [];
    for (let i = 1; i <= 4; i++) {
      const file = formData.get(`image${i}`);
      if (file && typeof file !== 'string') {
        filesToUpload.push(file);
      }
    }

    if (filesToUpload.length < 1) {
      return NextResponse.json({ error: 'Please upload at least 2 images' }, { status: 400 });
    }

    await connectDB();

    const uploadResults = [];

    for (const file of filesToUpload) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const tempPath = path.join(os.tmpdir(), file.name);
      await writeFile(tempPath, buffer);

      const result = await cloudinary.uploader.upload(tempPath, { folder: 'uploads' });

      await unlink(tempPath);
      uploadResults.push(result.secure_url);
    }

    const product = new productModel({
      productName,
      productDesc,
      productPrice,
      productOffer,
      productCategory,
      imageUrl: uploadResults,
      user: userId,
    });

    await product.save();
    return NextResponse.json({ message: 'Product uploaded successfully', product });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Error uploading product' }, { status: 500 });
  }
}
