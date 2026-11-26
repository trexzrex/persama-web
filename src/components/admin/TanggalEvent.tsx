"use client";

import { DateTimeField, FieldLabel } from "@payloadcms/ui";
import type { ConditionalDateProps } from "payload";
import { useId, type ComponentProps, type ReactNode } from "react";

function kalender(label: string) {
  return function Kalender({ children, className }: { children?: ReactNode; className?: string }) {
    return <div className={className} role="dialog" aria-label={`Pilih ${label}`}>{children}</div>;
  };
}

const KalenderMulai = kalender("tanggal mulai");
const KalenderSelesai = kalender("tanggal selesai");

export default function TanggalEvent(props: ComponentProps<typeof DateTimeField>) {
  const id = useId();
  const { field, path } = props;
  // Payload serializes this admin property as unknown in its client field type.
  const date = field.admin?.date as ConditionalDateProps | undefined;
  return (
    <div className="persama-tanggal-event">
      <FieldLabel htmlFor={id} label={field.label} localized={field.localized} required={field.required} />
      <DateTimeField
        {...props}
        field={{
          ...field,
          label: undefined,
          admin: {
            ...field.admin,
            placeholder: field.admin?.placeholder,
            date: {
              ...date,
              overrides: {
                ...date?.overrides,
                id,
                ariaRequired: field.required ? "true" : undefined,
                calendarContainer: path === "tanggalMulai" ? KalenderMulai : KalenderSelesai,
              },
            },
          },
        }}
      />
    </div>
  );
}
