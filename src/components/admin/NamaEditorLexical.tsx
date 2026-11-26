"use client";

import { createClientFeature, useEditorConfigContext } from "@payloadcms/richtext-lexical/client";
import { useLexicalComposerContext } from "@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext";
import { getTranslation } from "@payloadcms/translations";
import { useTranslation } from "@payloadcms/ui";
import { useEffect } from "react";

function NamaEditor() {
  const [editor] = useLexicalComposerContext();
  const { fieldProps } = useEditorConfigContext();
  const { i18n } = useTranslation();
  const label = fieldProps.field.label;
  const nama = label ? getTranslation(label, i18n) : undefined;

  useEffect(() => {
    if (typeof nama !== "string" || !nama) return;
    const dinamai = new Set<HTMLElement>();
    const hapusNama = (elemen: HTMLElement) => {
      if (dinamai.delete(elemen) && elemen.getAttribute("aria-label") === nama) {
        elemen.removeAttribute("aria-label");
      }
    };
    const lepas = editor.registerRootListener((root, sebelumnya) => {
      if (sebelumnya) hapusNama(sebelumnya);
      if (root && !root.hasAttribute("aria-labelledby") && !root.hasAttribute("aria-label")) {
        root.setAttribute("aria-label", nama);
        dinamai.add(root);
      }
    });
    return () => {
      lepas();
      dinamai.forEach(hapusNama);
    };
  }, [editor, nama]);

  return null;
}

export const NamaEditorLexical = createClientFeature({
  plugins: [{ Component: NamaEditor, position: "normal" }],
});
