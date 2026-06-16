import type { Metadata } from "next";
import { Geist, Geist_Mono, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HideOnAuth } from "@/components/hide-on-auth";
import { PageTracker } from "@/components/page-tracker";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Elegant formal-script fallback for the firm name (used when the licensed
// "Shelley Allegro Script" webfont isn't available).
const brandScript = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "P. R. Kumar & Co. — Chartered Accountants",
    template: "%s · P. R. Kumar & Co.",
  },
  description:
    "P. R. Kumar & Co. — New Delhi Chartered Accountancy firm (est. 1981). Advisory, Assurance and Tax services for corporates, banks and SMEs.",
  openGraph: {
    type: "website",
    siteName: "P. R. Kumar & Co.",
    title: "P. R. Kumar & Co. — Chartered Accountants",
    description: "New Delhi Chartered Accountancy firm since 1981 — Advisory, Assurance and Tax.",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Applies the saved/preferred theme before paint to avoid a flash.
  const themeScript = `(function(){try{var e=localStorage.getItem('theme');var d=e?e==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(_){}})();`;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${brandScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "AccountingService",
            name: site.name,
            description:
              "New Delhi Chartered Accountancy firm since 1981 — Advisory, Assurance and Tax.",
            url: siteUrl,
            telephone: site.contact.phone,
            email: site.contact.email,
            foundingDate: String(site.established),
            address: {
              "@type": "PostalAddress",
              streetAddress: site.contact.address,
              addressLocality: "New Delhi",
              postalCode: "110016",
              addressCountry: "IN",
            },
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <AuthProvider>
          <PageTracker />
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <HideOnAuth>
            <SiteFooter />
          </HideOnAuth>
        </AuthProvider>
      </body>
    </html>
  );
}
