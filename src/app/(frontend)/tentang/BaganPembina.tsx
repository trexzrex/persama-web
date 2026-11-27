import Image from "next/image";

import { susunBaganPembina, type SimpulBagan } from "@/lib/bagan-pembina";
import { alamatMedia } from "@/lib/content";
import type { Pengurus } from "@/lib/types";
import styles from "./bagan-pembina.module.css";

function Simpul({ simpul }: { simpul: SimpulBagan<Pengurus> }) {
  const { orang, anak } = simpul;
  const nama = orang.nama?.trim();
  const foto = alamatMedia(orang.foto, "thumbnail");
  const tataCabang = anak.length === 1 ? "lurus"
    : anak.length === 2 && anak[0].anak.length === 0 && anak[1].anak.length > 0 ? "samping"
    : anak.every((node) => node.anak.length === 0) && anak.length <= 7 ? "sejajar"
    : "susun";
  return (
    <li className={anak.length ? styles.bercabang : undefined}>
      <div className={styles.simpul}>
        <div className={styles.potret}>
          {foto ? (
            <Image src={foto} alt="" fill sizes="(min-width: 768px) 88px, 64px" />
          ) : (
            <svg aria-hidden="true" viewBox="0 0 48 48" fill="currentColor">
              <circle cx="24" cy="17" r="7" />
              <path d="M10 41v-3a14 14 0 0 1 28 0v3z" />
            </svg>
          )}
        </div>
        <div className={styles.plakat} data-kelompok={orang.kelompok}>
          <strong>{nama || orang.jabatan}</strong>
          {nama ? <span>{orang.jabatan}</span> : null}
        </div>
      </div>
      {anak.length ? (
        <div className={styles.kontainer}>
          <ul className={styles.anak} role="list" data-tata-cabang={tataCabang}>
            {anak.map((node) => <Simpul key={node.orang.id} simpul={node} />)}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

export function BaganPembina({ pembina }: { pembina: Pengurus[] }) {
  const akar = susunBaganPembina(pembina);
  return (
    <ul className={styles.akar} role="list">
      {akar.map((simpul) => <Simpul key={simpul.orang.id} simpul={simpul} />)}
    </ul>
  );
}
