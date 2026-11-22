import config from "@payload-config";
import { getPayload } from "payload";

export const dynamic = "force-dynamic";

/**
 * Titik pemeriksaan ringan untuk Vercel Cron.
 * Satu kueri kecil ke database mencegah proyek Supabase terjeda.
 */
export async function GET() {
  try {
    const payload = await getPayload({ config });
    await payload.count({ collection: "users" });

    return Response.json({
      ok: true,
      waktu: new Date().toISOString(),
    });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}
