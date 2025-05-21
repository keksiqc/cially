"use client";

import dynamic from "next/dynamic"; // Import next/dynamic
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import GuildNotFound from "@/app/_components/_events/guildNotFound";

// Dynamically import components
const GeneralMessageDataCard = dynamic(
	() => import("./_components/_message-charts/general_data"),
	{
		ssr: false,
		loading: () => <p>Loading general data card...</p>,
	},
);
const Last4Weeks = dynamic(
	() => import("./_components/_message-charts/last_4weeks"),
	{
		ssr: false,
		loading: () => <p>Loading last 4 weeks chart...</p>,
	},
);
const Last7d = dynamic(() => import("./_components/_message-charts/last_7d"), {
	ssr: false,
	loading: () => <p>Loading last 7 days chart...</p>,
});
const Last24h = dynamic(
	() => import("./_components/_message-charts/last_24hrs"),
	{
		ssr: false,
		loading: () => <p>Loading last 24 hours chart...</p>,
	},
);

export default function MessagesActivityPage() {
	return (
		<Suspense>
			{" "}
			{/* Suspense is already here, good for dynamic components with their own loading states */}
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
				`/api/server/${guildID}/fetchMessageData`,
			);
			const json = await chartDataReceived.json();
			setChartData(json);
		}
		fetchData();
	}, [guildID]);

	if (chartData?.notFound) {
		// Optional chaining
		return <GuildNotFound />;
	}
	// Show skeleton or loading state if chartData or finalData is not yet available
	if (!chartData || !chartData.finalData) {
		return (
			<>
				<div className="mt-10 ml-10 text-2xl">Messages Analytics</div>
				<hr className="mt-2 mr-5 ml-5 w-[200px] sm:w-full" />{" "}
				{/* Adjusted widths */}
				<div className="mt-10 grid max-w-xs grid-rows-3 gap-y-4 sm:mr-5 sm:ml-5 sm:max-w-full sm:grid-cols-3 sm:grid-rows-none sm:gap-x-3 sm:gap-y-0">
					{" "}
					{/* max-w-80 to max-w-xs or similar */}
					<Last24h chartData={null} /> {/* Pass null for skeleton state */}
					<Last7d chartData={null} /> {/* Pass null for skeleton state */}
					<Last4Weeks chartData={null} /> {/* Pass null for skeleton state */}
				</div>
				<div className="sm:mr-5 sm:ml-5">
					<GeneralMessageDataCard chartData={null} />{" "}
					{/* Pass null for skeleton state */}
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
		return (
			<>
				<div className="mt-10 ml-10 text-2xl">Messages Analytics</div>
				<hr className="mt-2 mr-5 ml-5 w-[200px] sm:w-full" />
				<div className="p-4">Loading data or data is unavailable...</div>
			</>
		);
	}

	const {
		HourData: data_24h,
		WeekData: data_7d,
		FourWeekData: data_4w,
		GeneralData: data_general,
	} = finalDataContent;

	return (
		<>
			<div className="mt-10 ml-10 text-2xl">Messages Analytics</div>
			<hr className="mt-2 mr-5 ml-5 w-[200px] sm:w-full" />{" "}
			{/* Adjusted widths */}
			<div className="mt-10 grid max-w-xs grid-rows-3 gap-y-4 sm:mr-5 sm:ml-5 sm:max-w-full sm:grid-cols-3 sm:grid-rows-none sm:gap-x-3 sm:gap-y-0">
				{" "}
				{/* max-w-80 to max-w-xs */}
				<Last24h chartData={data_24h} />
				<Last7d chartData={data_7d} />
				<Last4Weeks chartData={data_4w} />
			</div>
			<div className="sm:mr-5 sm:ml-5">
				<GeneralMessageDataCard chartData={data_general} />
			</div>
			<div className="mt-5 pb-5 text-center text-gray-600 text-xs">
				Thanks for using Cially Dashboard!
			</div>
		</>
	);
}
