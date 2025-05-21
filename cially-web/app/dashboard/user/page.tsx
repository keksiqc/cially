"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingUserCard from "./_components/loading-usercard";

const formSchema = z.object({
	id: z.string().min(5, {
		message: "Please enter a valid User ID",
	}),
});

import dynamic from "next/dynamic"; // Import next/dynamic
import { Suspense, useState } from "react";
import ErrorUserCard from "./_components/error-usercard";
import StaticUserCard from "./_components/static-usercard";

// Dynamically import components
const DynamicUserCard = dynamic(
	() => import("./_components/dynamic-usercard"),
	{
		ssr: false,
		loading: () => <LoadingUserCard />, // Use existing LoadingUserCard
	},
);

export default function UserSearchPage() {
	return (
		<Suspense>
			{" "}
			{/* Suspense is already here */}
			<ClientComponent />
		</Suspense>
	);
}

function ClientComponent() {
	const searchParams = useSearchParams();
	const guildID = searchParams.get("guildID");
	// Initial state: null for data, false for loading, null for error message
	const [userData, setUserData] = useState<any | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [fetchError, setFetchError] = useState<string | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		setFetchError(null);
		setUserData(null); // Clear previous user data

		const inputID = values.id; // Simplified input data access

		try {
			const dataReceived = await fetch(
				`/api/server/${guildID}/fetchUserData/${inputID}`,
			);
			const json = await dataReceived.json();
			if (json.error || (Array.isArray(json) && json[0]?.errorCode === 404)) {
				// Check for error response from API
				setFetchError("User not found or error fetching data.");
				setUserData(null);
			} else {
				// Assuming API returns the user data directly or in a specific structure
				// If json is already the array like [{userID: ...}], then just setUserData(json)
				// If json is like { finalData: [...] }, then setUserData(json.finalData)
				// For now, assuming json is the direct user data or array containing it.
				// The previous logic `setUserData(Array(json))` was problematic.
				// If API returns an array like `[{...user_data...}]`
				setUserData(json);
			}
		} catch (err) {
			console.error("onSubmit error:", err);
			setFetchError("An unexpected error occurred.");
			setUserData(null);
		} finally {
			setIsLoading(false);
		}
	}

	function Header() {
		return (
			<>
				<div className="mt-10 ml-10 text-2xl">User Search</div>
				<div className=" ml-10 text-sm text-white/50">
					Get details regarding any user in your Discord Server
				</div>
				<hr className="mt-2 mr-5 ml-5 w-[200px] sm:w-full" />{" "}
				{/* Adjusted width */}
				<div className="mx-5 mt-5">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
							<FormField
								control={form.control}
								name="id"
								render={({ field }) => (
									<FormItem>
										<div className="relative">
											<FormControl>
												<Input
													placeholder="User ID"
													{...field}
													className="peer pr-24"
												/>
											</FormControl>

											<Button
												type="submit"
												className="-translate-y-1/2 absolute top-1/2 right-2 h-8 translate-x-2 scale-95 rounded-full bg-transparent px-3 text-sm opacity-0 transition-all duration-300 ease-in-out hover:bg-white/5 peer-focus:translate-x-0 peer-focus:scale-100 peer-focus:opacity-100"
											>
												<Search className="text-white" />
											</Button>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</div>
			</>
		);
	}

	if (isLoading) {
		return (
			<>
				<Header />
				<LoadingUserCard />
			</>
		);
	}
	// Check if userData is an array and has content (userID is a property in the actual data)
	// The API might return an array like `[{...userData...}]` or an object directly.
	// Previous logic `userData[0].userID` suggests it expects an array.
	if (
		userData &&
		Array.isArray(userData) &&
		userData.length > 0 &&
		userData[0].userID
	) {
		return (
			<>
				<Header />
				<DynamicUserCard userData={userData} />
			</>
		);
	}
	// If there was an error OR if userData is null/empty after trying to fetch (and not loading)
	if (fetchError || !userData) {
		// Show StaticUserCard by default if no search made yet, or ErrorUserCard if fetchError exists
		return (
			<>
				<Header />
				{fetchError ? <ErrorUserCard /> : <StaticUserCard />}
			</>
		);
	}

	// Fallback, though ideally covered by above conditions
	return (
		<>
			<Header />
			<StaticUserCard />
		</>
	);
}
