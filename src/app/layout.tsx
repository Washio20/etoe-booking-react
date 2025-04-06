import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-zen-kaku-gothic",
});

export const metadata: Metadata = {
  title: "Etoe Hotel Booking",
  description: "Book your stay at Etoe Hotel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={zenKakuGothicNew.variable}>
      <body
        className={`${zenKakuGothicNew.className} antialiased`}
        suppressHydrationWarning
      >
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
