import React from "react";

export const metadata = {
  title: "GameCraft Studio — SEKOLAHKITA by JACS Developer",
  description: "Editor Modul Interaktif Pembelajaran",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-[#070b19] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
