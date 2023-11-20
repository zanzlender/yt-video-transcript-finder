import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import PlausibleProvider from "next-plausible";
import Script from "next/script";
import ToasterWrapper from "./_components/ToasterWrapper";

import { TRPCReactProvider } from "~/trpc/react";
import Link from "next/link";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Youtube transcript finder",
  description:
    "Store and search your video transcript to find exactly what you need!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          data-domain="tasky.study"
          src="http://localhost:8000/js/script.local.js"
        />
      </head>
      <body
        className={`relative font-sans ${inter.variable} h-fit min-h-screen bg-gradient-to-b from-[#0f0024] to-[#15162c] bg-repeat`}
      >
        <Suspense>
          <ToasterWrapper />
        </Suspense>

        <Header />

        <TRPCReactProvider cookies={cookies().toString()}>
          <main>{children}</main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

const Header = () => {
  return (
    <header className="h-20 border-b-2 border-[#370183] bg-gradient-to-b from-[#160e1a] to-[#101233]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between p-4 xl:p-0">
        <Link className="font-black text-white" href="/">
          YTF
        </Link>

        <nav>
          <ul className="flex items-center justify-between gap-8">
            <li>
              <Link
                className="text-white transition-all duration-200 hover:text-white/60"
                href="/"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                className="text-white transition-all duration-200 hover:text-white/60"
                href="/search"
              >
                Search
              </Link>
            </li>
            <li>
              <Link
                className="text-white transition-all duration-200 hover:text-white/60"
                href="/transcripts"
              >
                Transcripts
              </Link>
            </li>
            <li>
              <Link
                className="text-white transition-all duration-200 hover:text-white/60"
                href="/info"
              >
                Info
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

const Footer = () => {
  return <footer className="min-h-[200px] bg-white"></footer>;
};
