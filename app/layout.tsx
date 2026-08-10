import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

const monaSans = Mona_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quản lý nhà trọ Tuấn Việt",
  description:
    "Website quản lý nhà trọ Tuấn Việt, giúp quản lý phòng trọ, hợp đồng, hóa đơn và khách thuê một cách dễ dàng và hiệu quả.",
  keywords: [
    "quản lý trọ",
    "quản lý nhà trọ",
    "quản lý phòng trọ",
    "quản lý hợp đồng",
    "quản lý hóa đơn",
    "quản lý khách thuê",
    "trọ",
  ],
  authors: [{ name: "Nhà trọ Tuấn Việt" }],
  creator: "Nhà trọ Tuấn Việt",
  publisher: "Nhà trọ Tuấn Việt",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://nhatrotuanviet.uk"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://nhatrotuanviet.uk",
    title: "Quản lý nhà trọ Tuấn Việt",
    description:
      "Website quản lý nhà trọ Tuấn Việt, giúp quản lý phòng trọ, hợp đồng, hóa đơn và khách thuê một cách dễ dàng và hiệu quả.",
    siteName: "Nhà trọ Tuấn Việt",
    images: [
      {
        url: "/nhatrotuanviet-preview.png",
        width: 1200,
        height: 630,
        alt: "Nhà trọ Tuấn Việt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quản lý nhà trọ Tuấn Việt",
    description:
      "Website quản lý nhà trọ Tuấn Việt, giúp quản lý phòng trọ, hợp đồng, hóa đơn và khách thuê một cách dễ dàng và hiệu quả.",
    images: ["/nhatrotuanviet-preview.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  classification: "Nhà trọ Tuấn Việt",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#E15D3A" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={monaSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>{children}</QueryProvider>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
