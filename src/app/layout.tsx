import { MainNav, buttonVariants } from "@/components";
import { SiteFooter } from "@/components/molecules/SiteFooter";
import { NextAuthProvider, ThemeProvider } from "@/components/providers";
import "@/styles/globals.css";
import { cn } from "@/utils";
import { Inter as FontSans } from "next/font/google";
import Link from "next/link";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

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
