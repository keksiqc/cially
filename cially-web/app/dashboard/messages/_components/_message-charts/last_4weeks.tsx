"use client";
import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react"; // Import React for React.memo
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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

const Last4WeeksComponent = ({ chartData }) => {
	// Renamed for clarity
	const chartConfig = {
		amount: {
			label: "amount",
			color: "#03d5ff",
		},
	} satisfies ChartConfig;

	if (!chartData) {
		return (
			<>
				<Card>
					<CardHeader>
						<CardTitle>Last 4 weeks days</CardTitle>
						<CardDescription>
							Showing total messages for the last 4 weeks
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Skeleton className="h-[150px] w-[250px] place-self-center rounded-xl" />
					</CardContent>
					<CardFooter>
						<div className="flex w-full items-start gap-2 text-sm">
							<div className="grid gap-2">
								<div className="flex items-center gap-2 font-medium leading-none">
									<Skeleton className="h-[10px] w-20 place-self-center rounded-xl" />
								</div>
							</div>
						</div>
					</CardFooter>
				</Card>
			</>
		);
	}

	const ArrayChartData = Array(chartData)[0];

	const startingDate = new Date(Date.now() - 0 * 24 * 60 * 60 * 1000);
	const startingDate_factor = startingDate.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});

	const previousDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
	const previousDate_factor = previousDate.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});

	const currentAmount_index = ArrayChartData.findIndex(
		(item) => item.factor === startingDate_factor,
	);
	const currentAmount = ArrayChartData[currentAmount_index].amount;

	const previousAmount_index = ArrayChartData.findIndex(
		(item) => item.factor === previousDate_factor,
	);
	const previousAmount = ArrayChartData[previousAmount_index].amount;

	const difference = currentAmount - previousAmount;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Last 4 weeks days</CardTitle>
				<CardDescription>
					Showing total messages for the last 4 weeks
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<AreaChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: 15,
							right: 15,
						}}
					>
						<CartesianGrid vertical={true} />
						<XAxis
							dataKey="factor"
							tickLine={true}
							axisLine={true}
							tickMargin={0}
							tickFormatter={(value) => value.slice(0, 6)}
							interval={0}
							tick={{
								angle: -30,
								fontSize: 10,
								dx: -5,
								dy: 5,
							}}
						/>
						<ChartTooltip
							cursor={true}
							content={<ChartTooltipContent indicator="dot" hideLabel />}
						/>
						<Area
							dataKey="amount"
							type="linear"
							fill="var(--color-amount)"
							fillOpacity={0.4}
							stroke="var(--color-amount)"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
			<CardFooter>
				<div className="flex w-full items-start gap-2 text-sm">
					<div className="grid gap-2">
						<div className="flex items-center gap-2 font-medium leading-none">
							{difference > 0 ? (
								<div className="text-green-400">
									+{difference} than previous week{" "}
									<TrendingUp className="inline h-4 w-4" />
								</div>
							) : difference !== 0 ? (
								<div className="text-red-400">
									{difference} than previous week{" "}
									<TrendingDown className="inline h-4 w-4" />
								</div>
							) : (
								<div className="text-gray-400">
									+{difference} than previous week
								</div>
							)}
						</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
};

export default React.memo(Last4WeeksComponent); // Wrap with React.memo
