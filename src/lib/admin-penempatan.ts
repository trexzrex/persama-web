// Pilih area konten halaman utama; jangan masuk ke drawer/modal Payload.
export function tempatKembali(root: Document): HTMLElement | null {
  const area = root.querySelector<HTMLElement>(".template-default__wrap");
  if (!area) return null;
  for (const selector of [".persama-admin-divisi", ".doc-header", ".collection-list__wrap", ".app-header__step-nav-wrapper"]) {
    const target = Array.from(area.querySelectorAll<HTMLElement>(selector)).find(
      (element) => !element.closest('[role="dialog"], .drawer, .modal'),
    );
    if (target) return target;
  }
  return null;
}
