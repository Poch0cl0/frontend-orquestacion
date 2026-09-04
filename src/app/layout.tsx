import type { Metadata } from "next";
import { Geist, Inter, JetBrains_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { ArgusProvider } from "@/providers/ArgusProvider";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARGUS — AI Governance",
  description:
    "Consola de gobierno y observabilidad para operaciones de TI ejecutadas por consenso multi-agente.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geist.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        <ToastProvider>
          <ArgusProvider>
            <AppShell>{children}</AppShell>
          </ArgusProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
