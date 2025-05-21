"use client";

import { useEffect, useState } from "react";
import BottomCard from "./_main-components/bottom-card";
import MemberBlock from "./_main-components/member-card";
import MessagesBlock from "./_main-components/messages-card";

interface GuildData {
	name: string;
	id: string;
	icon: string;
	in_db: boolean;
}

function DashboardClientComponent({
	guildID,
}: {
	guildID: string | string[] | undefined;
}) {
	const [guildData, setGuildData] = useState<GuildData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const API_REQ = await fetch(`/api/server/${guildID}/fetchGuild`);
				if (!API_REQ.ok) {
					throw new Error(`Error fetching guild data: ${API_REQ.statusText}`);
				}
				const data = await API_REQ.json();
				setGuildData(data.guildFound[0] as GuildData);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("An unknown error occurred.");
				}
			} finally {
				setLoading(false);
			}
		}

		if (guildID) {
			fetchData();
		}
	}, [guildID]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!guildData) {
		return <div>No guild data found.</div>;
	}

	const currentHour = new Date().getHours();
	const welcome_message =
		currentHour < 12
			? "Good Morning"
			: currentHour < 18
				? "Good Afternoon"
				: "Good Evening";

	return (
		<>
			<div className="mt-10 mr-4 ml-10 grid grid-rows-3 sm:min-w-dvh sm:grid-rows-none">
				<div>
					<div className="rows-span-1 grid grid-rows-3 sm:grid-cols-8 sm:grid-rows-none ">
						<div className="text-4xl sm:col-span-2 ">
							{welcome_message}
							<div className="mt-2 font-normal text-gray-400 text-xs">
								Currently viewing {guildData.name}
							</div>
						</div>
						<div className="mr-4 sm:col-span-2 sm:col-start-4">
							<MemberBlock guild={guildData} />
						</div>
						<div className="mr-4 sm:col-span-2 sm:col-start-6">
							<MessagesBlock guild={guildData} />
						</div>
					</div>
				</div>

				<div className="row-span-3 sm:row-span-1">
					<BottomCard guild={guildData} />
					<div className="mt-5 pb-5 text-center text-gray-600 text-xs">
						Thanks for using Cially Dashboard!
					</div>
				</div>
			</div>
		</>
	);
}

export default async function Dashboard({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const guildID = (await searchParams).guildID;

	return <DashboardClientComponent guildID={guildID} />;
}
