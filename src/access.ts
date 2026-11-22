import type { Access } from "payload";

/** Semua orang boleh membaca. */
export const siapaSaja: Access = () => true;

/** Hanya admin yang login yang boleh mengubah. */
export const adminSaja: Access = ({ req: { user } }) => Boolean(user);

/**
 * Pengunjung hanya melihat dokumen yang sudah diterbitkan.
 * Admin tetap melihat draf lewat panel.
 */
export const terbitSaja: Access = ({ req: { user } }) => {
  if (user) return true;
  return { _status: { equals: "published" } };
};
