import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Jasmine Goh | UX/Product Designer",
    template: "%s | Jasmine Goh",
  },
  description: "UX/Product Designer based in Kuala Lumpur, Malaysia. Specializing in bridging design thinking, research-based data, and user needs to create impactful design solutions.",
  keywords: ["UX Designer", "Product Designer", "UI Design", "User Experience", "Malaysia", "Portfolio"],
  authors: [{ name: "Jasmine Goh" }],
  creator: "Jasmine Goh",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Jasmine Goh - Portfolio",
    title: "Jasmine Goh | UX/Product Designer",
    description: "UX/Product Designer specializing in creating impactful digital experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jasmine Goh | UX/Product Designer",
    description: "UX/Product Designer specializing in creating impactful digital experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
