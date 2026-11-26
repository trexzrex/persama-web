import { DefaultDashboard, LoginView, type DashboardViewServerProps } from "@payloadcms/next/views";
import type { AdminViewServerProps } from "payload";

// Bungkus tampilan asli tanpa mengganti formulir login atau widget Payload.
export function DashboardUtama(props: DashboardViewServerProps) {
  return <main><DefaultDashboard {...props} /></main>;
}

export function LoginUtama(props: AdminViewServerProps) {
  return <main><LoginView {...props} /></main>;
}
