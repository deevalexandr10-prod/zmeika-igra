import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Змейка — браузерная игра",
  description: "Классическая змейка с понятным управлением для компьютера и телефона.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
