import { Activity } from "lucide-react";
import React from "react"; // Import React for React.memo
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const GeneralActivityDataComponent = ({ chartData }) => {
	// Renamed for clarity
	if (!chartData) {
		return (
			<>
				<Card className="mt-10 grid auto-rows-auto px-10 sm:min-w-dvh">
					<div>
						<div className="font-semibold text-xl">
							<Activity className="mr-2 inline" />
							General Data
						</div>
						<div className="mt-1 font-sans text-sm text-white/60">
							More insights regarding guild's activity
						</div>
					</div>
					<Skeleton className="h-15 w-full" />
				</Card>
			</>
		);
	}

	let ArrayChartData = Array(chartData)[0];
	console.log(ArrayChartData);

	return (
		<>
			<Card className="mt-10 grid auto-rows-auto px-10 sm:min-w-dvh">
				<div>
					<div className="font-semibold text-xl">
						<Activity className="mr-2 inline" />
						General Data
					</div>
					<div className="mt-1 font-sans text-sm text-white/60">
						More insights regarding guild's activity
					</div>
				</div>
				<div className="grid grid-cols-2 ">
					<div className="">
						<div>
							Total Members:{" "}
							<p className="inline font-sans text-white/80">
								{ArrayChartData[0].total}
							</p>
						</div>
						<div>
							Online Members:{" "}
							<p className="inline font-sans text-white/80">
								{ArrayChartData[0].online}
							</p>
						</div>
					</div>
					<div>
						<div>
							Idle Members:{" "}
							<p className="inline font-sans text-white/80">
								{ArrayChartData[0].idle}
							</p>
						</div>
						<div>
							Offline Members:{" "}
							<p className="inline font-sans text-white/80">
								{ArrayChartData[0].offline}
							</p>
						</div>
					</div>
				</div>
			</Card>
		</>
	);
};

export default React.memo(GeneralActivityDataComponent); // Wrap with React.memo
