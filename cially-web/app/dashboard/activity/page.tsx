"use client";

import dynamic from "next/dynamic"; // Import next/dynamic
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react"; // Added Suspense to imports
import GuildNotFound from "@/app/_components/_events/guildNotFound";

// Dynamically import components
const ActiveChannels = dynamic(
	() => import("../activity/_components/active_channels"),
	{
		ssr: false,
		loading: () => <p>Loading active channels chart...</p>,
	},
);
const ActiveHours = dynamic(
	() => import("../activity/_components/active_hours"),
	{
		ssr: false,
		loading: () => <p>Loading active hours chart...</p>,
	},
);
const ActiveUsers = dynamic(
	() => import("../activity/_components/active_users"),
	{
		ssr: false,
		loading: () => <p>Loading active users chart...</p>,
	},
);
const GeneralActivityData = dynamic(
	() => import("./_components/general_data"),
	{
		ssr: false,
		loading: () => <p>Loading general data...</p>,
	},
);

// FIXME Error when there are no messages

export default function MessagesDashboard() {
	return (
		<Suspense>
			<ClientComponent />
		</Suspense>
	);
}

function ClientComponent() {
	const searchParams = useSearchParams();
	const guildID = searchParams.get("guildID");
	const [chartData, setChartData] = useState<any | null>(null); // Changed initial state to null

	useEffect(() => {
		async function fetchData() {
			const chartDataReceived = await fetch(
				`/api/server/${guildID}/fetchActivityData`,
			);
			const json = await chartDataReceived.json();
			setChartData(json);
			console.log(json);
		}
		fetchData();
	}, [guildID]);

	if (chartData?.notFound) {
		// Added optional chaining
		return <GuildNotFound />;
	}

	// Show skeleton or loading state if chartData or finalData is not yet available
	if (!chartData || !chartData.finalData) {
		return (
			<>
				<div className="mt-10 ml-10 text-2xl">Activity Analytics</div>
				<hr className="mt-2 mr-5 ml-5 w-[200px] sm:w-full" />{" "}
				{/* w-50 to w-[200px], sm:w-dvh to sm:w-full */}
				<div className="h-[90%]">
					{/* Using fractional widths as an example, or could use more specific % or rem values */}
					<div className="mt-10 mr-5 ml-10 grid w-2/5 grid-cols-1 gap-5 sm:w-5/6 sm:grid-cols-2">
						<div>
							<ActiveChannels chartData={null} />{" "}
							{/* Pass null or empty for skeleton state */}
						</div>
						<div>
							<ActiveUsers chartData={null} />{" "}
							{/* Pass null or empty for skeleton state */}
						</div>
					</div>

					<div className="mt-5 mr-5 ml-10 w-2/5 sm:w-5/6">
						<ActiveHours chartData={null} />{" "}
						{/* Pass null or empty for skeleton state */}
						<div className="mt-5">
							<GeneralActivityData chartData={null} />{" "}
							{/* Pass null or empty for skeleton state */}
						</div>
					</div>
				</div>
				<div className="mt-5 pb-5 text-center text-gray-600 text-xs">
					Thanks for using Cially Dashboard!
				</div>
			</>
		);
	}

	// Ensure finalData[0] exists before trying to access its properties
	const finalDataContent = chartData.finalData?.[0];
	if (!finalDataContent) {
		// This case handles if finalData is an empty array or structure is unexpected
		// You might want to show a specific error or a more targeted skeleton here
		return (
			<>
				<div className="mt-10 ml-10 text-2xl">Activity Analytics</div>
				<hr className="mt-2 mr-5 ml-5 w-[200px] sm:w-full" />
				<div className="p-4">Loading data or data is unavailable...</div>
			</>
		);
	}

	const {
		ChannelData: data_channels,
		ActiveUsersData: data_users,
		ActiveHourData: data_hours,
		GeneralData: data_general,
	} = finalDataContent;

	return (
		<>
			<div className="mt-10 ml-10 text-2xl">Activity Analytics</div>
			<hr className="mt-2 mr-5 ml-5 w-[200px] sm:w-full" />{" "}
			{/* w-50 to w-[200px], sm:w-dvh to sm:w-full */}
			<div className="h-[90%]">
				<div className="mt-10 mr-5 ml-10 grid w-2/5 grid-cols-1 gap-5 sm:w-5/6 sm:grid-cols-2">
					{" "}
					{/* Fractional widths */}
					<div>
						<ActiveChannels chartData={data_channels} />
					</div>
					<div>
						<ActiveUsers chartData={data_users} />
					</div>
				</div>

				<div className="mt-5 mr-5 ml-10 w-2/5 sm:w-5/6">
					{" "}
					{/* Fractional widths */}
					<ActiveHours chartData={data_hours} />
					<div className="mt-5">
						<GeneralActivityData chartData={data_general} />
					</div>
				</div>
			</div>
			<div className="mt-5 pb-5 text-center text-gray-600 text-xs">
				Thanks for using Cially Dashboard!
			</div>
		</>
	);
}
