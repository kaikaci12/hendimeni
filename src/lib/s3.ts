import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const publicBaseUrl = (
  process.env.S3_PUBLIC_URL || "https://pub-ef79860bfe2745fea6aa1d7d255bc686.r2.dev"
).replace(/\/$/, "");

export const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_API!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET = process.env.S3_BUCKET_NAME!;

/**
 * Upload a file buffer to R2 and return the public URL.
 * Key format: `photos/{userId}/{timestamp}-{filename}`
 */
export async function uploadPhoto(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  // R2 public bucket URL — adjust if using a custom domain
  return `${publicBaseUrl}/${key}`;
}
