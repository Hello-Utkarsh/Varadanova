import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VERDANOVA | Waste Risk Assessment, Prioritisation and Mitigation System",
  description: "An intelligent waste-management risk intelligence platform inspired by ISO 31000 and FMEA. Turn waste data into risk insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
