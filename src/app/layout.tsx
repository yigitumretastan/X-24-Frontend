import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import ReactQueryProvider from "./contexts/ReactQueryProvider";
import { SignalRProvider } from "./contexts/SignalRContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./hooks/useToast";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Zeniva - İş Yönetim Sistemi",
	description:
		"Zeniva ile işlerinizi kolayca yönetin, takım çalışmanızı optimize edin",
	alternates: {
		types: {
			"application/rss+xml": [{ url: "/feed.xml", title: "Zeniva RSS Feed" }],
			"application/feed+json": [
				{ url: "/feed.json", title: "Zeniva JSON Feed" },
			],
		},
	},
	other: {
		rss: "/feed.xml",
		feed: "/feed.json",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider>
					<ReactQueryProvider>
						<TooltipProvider delay={0}>
							<AuthProvider>
								<SignalRProvider>
									<ToastProvider>{children}</ToastProvider>
								</SignalRProvider>
							</AuthProvider>
						</TooltipProvider>
					</ReactQueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
