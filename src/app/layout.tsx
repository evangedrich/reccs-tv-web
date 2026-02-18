import type { Metadata } from "next";
import "./globals.css";
import Nav from '@/app/components/nav';

export const metadata: Metadata = {
  title: "RECCS",
  description: "Reccs Streaming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div>{/* <div style={{aspectRatio:'16 / 9',}}> */}
          <Nav />
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
