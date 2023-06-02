import { MainNav, buttonVariants } from "@/components";
import { SiteFooter } from "@/components/molecules/SiteFooter";
import { NextAuthProvider, ThemeProvider } from "@/components/providers";
import { siteConfig } from "@/lib";
import "@/styles/globals.css";
import { cn } from "@/utils";
import { Inter as FontSans } from "next/font/google";
import Link from "next/link";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata = {
    metadataBase: new URL(siteConfig.url),
    generator: "Next.js",
    referrer: "origin-when-cross-origin",
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: ["Typing", "Game", "Type", "Speed"],
    authors: [
        {
            name: "kyle",
            url: "https://kylewong.my",
        },
    ],
    creator: "kyle",
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
    },
    icons: {
        icon: [
            {
                url: "/favicon-32x32.png",
                sizes: "32x32",
                type: "image/png",
            },
            {
                url: "/favicon-16x16.png",
                sizes: "16x16",
                type: "image/png",
            },
        ],
        shortcut: ["/favicon.ico"],
        apple: [
            {
                url: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
        other: [
            {
                rel: "mask-icon",
                url: "/safari-pinned-tab.svg",
            },
        ],
    },
    manifest: `${siteConfig.url}/site.webmanifest`,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            suppressHydrationWarning={true}
        >
            <body
                className={cn(
                    "min-h-screen bg-background font-sans text-sm antialiased",
                    fontSans.variable
                )}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <NextAuthProvider>
                        <div>
                            <header className="container z-40 bg-background">
                                <div className="flex h-20 items-center justify-between py-6">
                                    <MainNav items={[]} />
                                    <nav>
                                        <Link
                                            href="/login"
                                            className={cn(
                                                buttonVariants({
                                                    variant: "secondary",
                                                    size: "sm",
                                                }),
                                                "px-4"
                                            )}
                                        >
                                            Login
                                        </Link>
                                    </nav>
                                </div>
                            </header>
                            <main className="container">{children}</main>
                            <SiteFooter />
                        </div>
                    </NextAuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
