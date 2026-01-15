import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";

// Distinctive serif for headings - elegant, editorial feel
const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

// Refined sans-serif for body text - clean and readable
const dmSans = DM_Sans({
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
    <html lang="en" className={`${dmSerifDisplay.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
