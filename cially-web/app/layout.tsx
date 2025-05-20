import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./_components/_shadcn/theme-provider";
import { cookies } from "next/headers";

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

export default async function RootLayout({ children }: RootLayoutProps) {
	const cookieStore = await cookies();
	const theme = cookieStore.get("theme") || {value: "blue"};
	console.log(theme);
	const gridClass = {
			blue: "bg-gr",
			gray: "bg-gr-gray",
			pink: "bg-gr-pink",
			brown: "bg-gr-brown",
		}[theme.value];
	console.log(gridClass)

	return (
		<>
			<html lang="en" suppressHydrationWarning>
				<head />
				<body className="">
					<div className="overflow-x-hidden min-h-screen">
						<div className={`${gridClass} fixed inset-0 w-full h-full -z-10`} />
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
