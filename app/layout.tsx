import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const B = localFont({
  src: "./fonts/bbtorsospro-bold.otf"
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${B.className} min-h-svh overflow-x-hidden antialiased text-pretty`}
          cz-shortcut-listen="true"
        >
          <div vaul-drawer-wrapper="">
            <div className="relative flex min-h-svh flex-col">
              <CartProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
                  disableTransitionOnChange
                >
                  {children}
                </ThemeProvider>
                <Toaster />
              </CartProvider>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
