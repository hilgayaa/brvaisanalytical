import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT ?? "",
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY ?? "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY ?? "",
});

export async function POST(req:any) {
  const formData = await req.formData();
  const file = formData.get("file");

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const upload = await imagekit.upload({
    file: buffer,
    fileName: `${Date.now()}-${file.name}`,
    folder: "/pdfs",
  });

  return NextResponse.json(upload);
}
