import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; // Removed Geist imports, Outfit is used in globals.css
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
	// Assuming RootLayoutProps is defined elsewhere or should be React.PropsWithChildren
	return (
		<>
			<html lang="en" suppressHydrationWarning>
				{/* <head /> Removed empty head */}
				<body>
					{" "}
					{/* Removed empty className */}
					<div className="min-h-screen overflow-x-hidden">
						<div className="-z-10 fixed inset-0 h-full w-full bg-main-gradient"></div>{" "}
						{/* Updated bg-gr to bg-main-gradient */}
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
