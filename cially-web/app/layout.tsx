import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./_components/_shadcn/theme-provider";

export const metadata: Metadata = {
	title: "Cially Dashboard",
};

import type { Viewport } from "next";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<>
			<html lang="en" suppressHydrationWarning>
				<head />
				<body className="">
					<div className="overflow-x-hidden min-h-screen">
						<div className="bg-gr fixed inset-0 w-full h-full -z-10"></div>
						<div className="relative z-0 p-6">
							<ThemeProvider
								attribute="class"
								defaultTheme="dark"
								enableSystem
								disableTransitionOnChange
							>
								{children}
							</ThemeProvider>
						</div>
					</div>
				</body>
			</html>
		</>
	);
}
