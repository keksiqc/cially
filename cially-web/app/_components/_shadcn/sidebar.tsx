"use client";

import {
	Bolt,
	// Calendar, // Removed unused import
	ChartLine,
	Home,
	House,
	Inbox,
	SatelliteDish,
	UserSearch,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
// import { badgeVariants } from "@/components/ui/badge"; // Removed unused import
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar({ isGuild }) {
	return (
		<Suspense>
			<ClientComponent isGuild={isGuild} />
		</Suspense>
	);
}

function ClientComponent({ isGuild }) {
	const searchParams = useSearchParams();

	const guildID = searchParams ? searchParams.get("guildID") : null; // Changed fallback to null

	// Analytics items
	const items = [
		{
			title: "General",
			url: `/dashboard?guildID=${guildID}`,
			icon: Home,
		},
		{
			title: "Messages",
			url: `/dashboard/messages?guildID=${guildID}`,
			icon: Inbox,
		},
		{
			title: "Activity",
			url: `/dashboard/activity?guildID=${guildID}`,
			icon: ChartLine,
		},
		{
			title: "User Search",
			url: `/dashboard/user?guildID=${guildID}`,
			icon: UserSearch,
		},
	];

	// Cially items
	const cially_items = [
		{
			title: "Home",
			url: `/`,
			icon: House,
		},
		{
			title: "Settings",
			url: `/cially/settings`,
			icon: Bolt,
		},
		{
			title: "Status",
			url: `/cially/status`,
			icon: SatelliteDish,
		},
	];
	return (
		<Sidebar className="rounded-lg border border-white/0 bg-white/4 backdrop-blur-md">
			<SidebarHeader>
				<a href="/">
					<Image
						src="/logo-png.png"
						className="w-20 place-self-center"
						alt="Cially logo"
						width={80}
						height={80}
					/>
				</a>
				<hr></hr>
			</SidebarHeader>
			<SidebarContent>
				{isGuild ? (
					<div className=" mb-8">
						<SidebarGroupLabel className="ml-1">
							Server Analytics
						</SidebarGroupLabel>
						<SidebarGroupContent className="ml-3 w-[200px]">
							{" "}
							{/* Changed w-50 to w-[200px] */}
							<SidebarMenu>
								{items.map((item) => (
									// Disable link if guildID is null for items that need it
									<SidebarMenuItem
										key={item.title}
										className={
											!guildID && item.url.includes("guildID")
												? "pointer-events-none opacity-50"
												: ""
										}
									>
										<SidebarMenuButton asChild>
											<a href={guildID ? item.url : "#"}>
												{" "}
												{/* Prevent navigation if guildID is null */}
												<item.icon />
												<span>{item.title}</span>
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</div>
				) : null}

				{/* Correct "Dashboard" section */}
				<SidebarGroupLabel className="ml-1">Dashboard</SidebarGroupLabel>
				<SidebarGroupContent className="ml-3 w-[200px]">
					<SidebarMenu>
						{cially_items.map((item) => (
							<SidebarMenuItem
								key={item.title}
								className="rounded-sm from-white/0 to-white/10 transition-all hover:bg-gradient-to-r"
							>
								<SidebarMenuButton asChild>
									<a href={item.url}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarContent>
			<SidebarFooter className="place-items-center">
				<a href="https://github.com/skellgreco/cially">
					<Badge variant="secondary" className="">
						Version: 1.0
					</Badge>
				</a>
			</SidebarFooter>
		</Sidebar>
	);
}
