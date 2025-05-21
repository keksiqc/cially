"use client";

import { CheckCircle, Database, Rss, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import GuildNotFound from "@/app/_components/_events/guildNotFound";
import LoadingSVG from "@/app/_components/_events/loading-page";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface ServiceStatus {
	pocketbase?: "online" | "offline";
	bot?: "online" | "offline";
}

export default function Status() {
	const [status, setStatus] = useState<ServiceStatus | null>(null); // Changed state structure and initial value
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			try {
				const response = await fetch(`/api/cially/checkStatus`);
				const json: Array<{ pocketbase?: string; bot?: string }> =
					await response.json(); // Expecting array like [{pocketbase: "online"}, {bot: "online"}]

				const pbService = json.find((s) => s.pocketbase);
				const botService = json.find((s) => s.bot);

				setStatus({
					pocketbase:
						(pbService?.pocketbase as ServiceStatus["pocketbase"]) || "offline",
					bot: (botService?.bot as ServiceStatus["bot"]) || "offline",
				});
				console.debug("Fetched status:", json);
			} catch (error) {
				console.error("Failed to fetch status:", error);
				setStatus({ pocketbase: "offline", bot: "offline" }); // Set to offline on error
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	if (loading || !status) {
		// Check for loading or if status is null
		return (
			<div className="grid h-screen place-items-center">
				{" "}
				{/* Centered loading SVG */}
				<LoadingSVG />
			</div>
		);
	}
	// At this point, status object should be populated
	const { pocketbase: pbStatus, bot: botStatus } = status;

	return (
		<>
			<div className="min-h-full min-w-full ">
				<div>
					<div className="mt-4 ml-2 text-2xl">Status</div>
					<div className="mt-1 ml-2 text-sm text-white/50">
						Check if Cially's Services are operating normally
					</div>
				</div>
				<div className="-ml-0 mx-auto mt-8 mr-10 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
					<Card className="transition-all duration-300 hover:shadow-md">
						<CardHeader className="pb-2">
							<div className="flex items-center">
								<div className="mr-3 rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
									<Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<CardTitle className="text-lg">Pocketbase</CardTitle>
									<CardDescription>Database Service</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="mt-2">
								<Badge
									variant={pbStatus === "online" ? "success" : "destructive"}
									className={
										pbStatus === "online"
											? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
											: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
									}
								>
									<div className="flex items-center">
										{pbStatus === "online" ? (
											<CheckCircle className="mr-1 h-4 w-4" />
										) : (
											<XCircle className="mr-1 h-4 w-4" />
										)}
										{pbStatus === "online" ? "Online" : "Offline"}
									</div>
								</Badge>
							</div>
						</CardContent>
					</Card>

					<Card className="transition-all duration-300 hover:shadow-md">
						<CardHeader className="pb-2">
							<div className="flex items-center">
								<div className="mr-3 rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
									<Rss className="h-5 w-5 text-purple-600 dark:text-purple-400" />
								</div>
								<div>
									<CardTitle className="text-lg">
										Discord Bot & API #2
									</CardTitle>
									<CardDescription>Communication Service</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="mt-2">
								<Badge
									variant={botStatus === "online" ? "success" : "destructive"}
									className={
										botStatus === "online"
											? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
											: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
									}
								>
									<div className="flex items-center">
										{botStatus === "online" ? (
											<CheckCircle className="mr-1 h-4 w-4" />
										) : (
											<XCircle className="mr-1 h-4 w-4" />
										)}
										{botStatus === "online" ? "Online" : "Offline"}
									</div>
								</Badge>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
	// Removed extra closing brace that was here
}
