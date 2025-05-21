"use client";

import { redirect, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation"; // Import useRouter
import { Suspense, useEffect, useState } from "react";
import GuildNotFound from "../_components/_events/guildNotFound";
import LoadingSVG from "../_components/_events/loading-page";

function ClientComponent() {
	const searchParams = useSearchParams();
	const router = useRouter(); // Initialize useRouter
	const guildID = searchParams.get("guildID");
	const [guildPageData, setGuildPageData] = useState<any | null>(null); // Renamed state, initial state null
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!guildID) {
			// Prevent fetch if guildID is null
			setLoading(false);
			// Optionally, redirect to an error page or show an error message
			// For now, it will fall through to GuildNotFound via guildPageData.notFound logic
			setGuildPageData({ notFound: true });
			return;
		}
		async function fetchData() {
			setLoading(true);
			try {
				const dataReceived = await fetch(`/api/server/${guildID}/fetchGuild`);
				const json = await dataReceived.json();
				setGuildPageData(json);
			} catch (error) {
				console.error("Failed to fetch guild page data:", error);
				setGuildPageData({ notFound: true }); // Set to notFound on error
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, [guildID]);

	if (loading) {
		return <LoadingSVG />;
	}

	if (guildPageData?.notFound || !guildID) {
		// Check guildID as well
		return <GuildNotFound />;
	}

	if (guildPageData?.guildFound) {
		// Perform redirect after a short delay to ensure it's not during render phase if possible,
		// or ensure this component doesn't try to render anything else.
		// For Next.js 13+ app router, router.push is preferred in Client Components.
		router.push(`dashboard?guildID=${guildID}`);
		return <LoadingSVG />; // Show loading while redirecting
	}

	// Fallback or if guildFound is not immediately available but no error (should ideally be covered by loading)
	return <LoadingSVG />;
}

export default function DataDashboard() {
	return (
		<Suspense fallback={<LoadingSVG />}>
			<ClientComponent />
		</Suspense>
	);
}
