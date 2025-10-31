import { db } from "../lib/firebase";
import { ref as dbRef, push, set, serverTimestamp } from "firebase/database";

export type NewProduct = {
  name: string;
  price: number;
  category?: string;
  description?: string;
};

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!;

export async function uploadToCloudinary(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Please upload an image.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be < 5MB.");

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  // If you set a default folder in the preset, you don't need to append folder.
  form.append("folder", "products");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Cloudinary upload failed: ${txt}`);
  }

  const data = await res.json();
  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
    width: data.width as number,
    height: data.height as number,
    format: data.format as string,
  };
}

export async function saveProductWithCloudinary(file: File, data: NewProduct) {
  const { url, publicId } = await uploadToCloudinary(file);

  // save product metadata + image URL to Realtime DB
  const productsRef = dbRef(db, "products");
  const newRef = push(productsRef);
  await set(newRef, {
    ...data,
    imageUrl: url,
    imagePublicId: publicId,  // keep for delete/replace later
    createdAt: serverTimestamp(),
  });

  return { id: newRef.key!, imageUrl: url, imagePublicId: publicId };
}
