import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatBotButton from "@/components/chatbots/ChatBotButton";
import Headers from "@/components/headers/Headers";
import ReduxProvider from "@/store/ReduxProvider";
// import ReduxProvider from "@/store/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agentic-Webpilot | An Agentic AI Web Chatbot",
  description: `Agentic WebPilot (An Agentic AI web Chatbot that stay with you through
websites) is an AI-powered browser companion designed to make web
navigation smarter and effortless. By attaching directly to the browser, WebPilot
understands user commands and executes them in real-time. Whether it’s
guiding you through different sections of a website, locating specific
information, or seamlessly jumping to another site, Agentic WebPilot acts as
your intelligent co-pilot for the internet. With its command-based interaction,
users can explore the web more efficiently without manual searching or clicking,
making browsing faster, simpler, and more`,
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          {children}
          <ChatBotButton />
        </ReduxProvider>
      </body>
    </html>
  );
}
