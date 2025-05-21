"use client";

import Image from "next/image";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	// CardContent, // Removed unused import
	// CardDescription, // Removed unused import
	// CardFooter, // Removed unused import
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export default function MessagesDashboard() {
	return (
		<Suspense>
			<ClientComponent />
		</Suspense>
	);
}

function ClientComponent() {
	const [guildData, setGuildData] = useState<any | null>(null); // Changed initial state to null and type to any for now

	useEffect(() => {
		async function fetchData() {
			try {
				const DataReceived = await fetch(`/api/fetchGuilds`);
				const json = await DataReceived.json();
				setGuildData(json.data);
				console.debug("Fetched guild data:", json); // Changed to console.debug
			} catch (err) {
				console.error("Failed to fetch guild data:", err);
				setGuildData({ error: true }); // Set an error state
			}
		}
		fetchData();
	}, []);

	try {
		console.debug("Current guildData state:", guildData); // Changed to console.debug
		if (!guildData || guildData.error || !guildData.AvailableGuilds) {
			// Added check for guildData itself and error state
			// Render loading or error state before attempting to access AvailableGuilds
			if (guildData?.error) {
				// This is the error state from the catch block in fetchData
				return (
					<>
						<div className="w-20 place-self-center">
							<Image src="/logo-png.png" alt="logo" width={80} height={80} />
						</div>
						<div className="mx-5 text-center">
							Failed to load guild data. Please try again later.
						</div>
					</>
				);
			}
			// This is the initial loading state or if AvailableGuilds is missing
			return (
				<>
					<div className="w-20 place-self-center">
						<Image src="/logo-png.png" alt="logo" width={80} height={80} />
					</div>
					<div className="text-center text-2xl">Available Guilds</div>
					<div className="text-center text-gray-400 text-sm">
						Please Select the Guild you would like to view
					</div>

					<div className="mb-10" />

					<div className="mx-10 grid grid-cols-1 gap-y-5 sm:grid-cols-3">
						<Skeleton className="h-[150px] w-[250px] place-self-center rounded-xl" />
						<Skeleton className="h-[150px] w-[250px] place-self-center rounded-xl" />
						<Skeleton className="h-[150px] w-[250px] place-self-center rounded-xl" />
					</div>

					<div className="mt-15 pb-5 text-center text-gray-600 text-xs">
						Thanks for using Cially Dashboard!
					</div>
				</>
			);
		}

		// At this point, guildData and guildData.AvailableGuilds should exist
		const guildDataArray = guildData.AvailableGuilds;
		const guildLength = guildDataArray.length;
		const grid_column_number = guildLength > 2 ? 3 : guildLength > 1 ? 2 : 1;
		const gridClass = {
			1: "sm:grid-cols-1",
			2: "sm:grid-cols-2",
			3: "sm:grid-cols-3",
		}[grid_column_number];

		const guildCards = guildDataArray.map((guild) =>
			guild.in_db === true ? (
				<a href={`/guild?guildID=${guild.id}`} key={guild.id}>
					<Card className="mx-5 transition-all hover:bg-white/2">
						<CardHeader className="place-items-center">
							<Avatar className=" h-20 w-20">
								<AvatarImage src={guild.icon} />
								<AvatarFallback>Guild</AvatarFallback>
							</Avatar>
							<CardTitle className="mt-5">{guild.name}</CardTitle>
						</CardHeader>
					</Card>
				</a>
			) : (
				<TooltipProvider key={guild.id}>
					<Tooltip>
						<TooltipTrigger>
							<Card className="mx-5 cursor-not-allowed bg-red-400/10 transition-all hover:bg-red-400/7">
								<CardHeader className="place-items-center">
									<Avatar className=" h-20 w-20">
										<AvatarImage src={guild.icon} />
										<AvatarFallback>Guild</AvatarFallback>
									</Avatar>
									<CardTitle className="mt-5">{guild.name}</CardTitle>
								</CardHeader>
							</Card>
						</TooltipTrigger>
						<TooltipContent className="text-white">
							<p>
								There is not enough data for this server! Please let the bot
								fetch some data and try again later!
							</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			),
		);

		return (
			<>
				<div className="w-20 place-self-center">
					<Image src="/logo-png.png" alt="logo" width={80} height={80} />
				</div>
				<div className="text-center text-2xl">Available Guilds</div>
				<div className="text-center text-gray-400 text-sm">
					Please Select the Guild you would like to view
				</div>

				<div className="mb-10" />
				<div className={`grid grid-cols-1 gap-y-5 ${gridClass} mx-10`}>
					{guildCards}
				</div>

				<div className="mt-15 pb-5 text-center text-gray-600 text-xs">
					Thanks for using Cially Dashboard!
				</div>
			</>
		);
	} catch (err) {
		const error = err.toString();

		// TODO add this error screen to every place where fetching occurs

		return (
			<>
				<div className="w-20 place-self-center">
					<Image src="/logo-png.png" alt="logo" width={80} height={80} />
				</div>
				<div className="mx-5 text-center">
					Looks like the Discord Bot can't communicate with the Dashboard.
					<br />
					Please make sure that you followed the setup instructions correctly
					and that the bot is up and running!
					<br />
					<br />
					Are you facing other issues? Check our GitHub and seek support!
					<br />
					<a
						href="https://github.com/skellgreco/cially"
						className="text-blue-400 underline"
					>
						GitHub Redirect
					</a>
					<br />
					<br />
					<div>Error {err.name}</div>
					<div>{error}</div>
				</div>
			</>
		);
	}
}
