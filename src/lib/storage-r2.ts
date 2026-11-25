import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

// No cache: each admin refresh reads a fresh bucket listing. Never return partial totals.
export async function bacaStorageR2(): Promise<{ byte: number; jumlah: number; waktu: string } | null> {
  const { R2_BUCKET, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
  if (!R2_BUCKET || !R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) return null;
  const client = new S3Client({
    region: "auto", endpoint: R2_ENDPOINT, forcePathStyle: true, maxAttempts: 2,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  });
  const signal = AbortSignal.timeout(10000);
  try {
    let token: string | undefined;
    let byte = 0;
    let jumlah = 0;
    for (let halaman = 0; halaman < 100; halaman++) {
      const hasil = await client.send(new ListObjectsV2Command({
        Bucket: R2_BUCKET, MaxKeys: 1000, ContinuationToken: token,
      }), { abortSignal: signal });
      for (const objek of hasil.Contents ?? []) {
        byte += objek.Size ?? 0;
        jumlah++;
      }
      if (!hasil.IsTruncated) return { byte, jumlah, waktu: new Date().toISOString() };
      if (!hasil.NextContinuationToken || hasil.NextContinuationToken === token) return null;
      token = hasil.NextContinuationToken;
    }
    return null;
  } catch {
    return null;
  } finally {
    client.destroy();
  }
}
