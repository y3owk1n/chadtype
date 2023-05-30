import { NextAuthProvider, ThemeProvider } from "@/components/providers";
import "@/styles/globals.css";
import { cn } from "@/utils";
import { Inter as FontSans } from "next/font/google";

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
                        <main className="container">{children}</main>
                    </NextAuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
