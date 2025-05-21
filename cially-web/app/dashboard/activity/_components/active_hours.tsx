"use client";
import { CartesianGrid, XAxis } from "recharts";
import { Bar, BarChart, LabelList } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
	desktop: {
		label: "Desktop",
		color: "#03d5ff",
	},
} satisfies ChartConfig;

import React from "react"; // Import React for React.memo

const ActiveHoursComponent = ({ chartData }) => {
	// Renamed for clarity
	if (!chartData) {
		return (
			<>
				<Card className="h-full w-full">
					<CardHeader>
						<CardTitle>Most Active Hours (UTC)</CardTitle>
						<CardDescription>Last 4 weeks</CardDescription>
					</CardHeader>
					<CardContent className="pb-0">
						<Skeleton className="h-30 w-full" />
					</CardContent>
					<CardFooter className="flex items-center justify-center gap-2 text-sm">
						<Skeleton className="h-5 w-20 rounded-md" />
					</CardFooter>
				</Card>
			</>
		);
	}
	return (
		<Card className="h-full w-full">
			<CardHeader>
				<CardTitle>Most Active Hours (UTC)</CardTitle>
				<CardDescription>Last 4 weeks</CardDescription>
			</CardHeader>
			<CardContent className="pt-2 pb-4">
				<ChartContainer
					config={chartConfig}
					className="w-full"
					style={{ height: "300px" }} // Set explicit height
				>
					<BarChart
						accessibilityLayer
						data={chartData}
						margin={{
							top: 20,
							bottom: 20,
							left: 10,
							right: 10,
						}}
						height={260} // Set explicit height for the BarChart
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="hour"
							tickLine={true}
							tickMargin={10}
							axisLine={true}
							tickFormatter={(value) => value.slice(0, 2)}
						/>
						<ChartTooltip
							cursor={true}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar dataKey="amount" fill="var(--color-desktop)" radius={4}>
							<LabelList
								position="top"
								offset={12}
								className="fill-foreground"
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex items-center justify-center gap-2 text-sm"></CardFooter>
		</Card>
	);
};

export default React.memo(ActiveHoursComponent); // Wrap with React.memo
