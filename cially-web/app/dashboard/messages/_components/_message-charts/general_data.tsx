import { Activity } from "lucide-react";
import React from "react"; // Import React for React.memo
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const GeneralMessageDataCardComponent = ({ chartData }) => {
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
							More insights regarding the messages and their content
						</div>
					</div>
					<Skeleton className="h-15 w-full" />
				</Card>
			</>
		);
	}

	const ArrayChartData = Array(chartData)[0];
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
						More insights regarding the messages and their content
					</div>
				</div>
				<div className="grid grid-cols-2 gap-x-3">
					<div className="">
						<div>
							Messages:{" "}
							<p className="inline font-sans text-white/80">
								{ArrayChartData[0].total_messages}
							</p>
						</div>
						<div>
							Media Sent:{" "}
							<p className="inline font-sans text-white/80">
								{ArrayChartData[0].total_attachments}
							</p>
						</div>
					</div>
					<div>
						<div>
							Message Deletions:{" "}
							<p className="inline font-sans text-white/80">
								{ArrayChartData[0].message_deletions}
							</p>
						</div>
						<div>
							Message Edits:{" "}
							<p className="inline font-sans text-white/80">
								{ArrayChartData[0].message_edits}
							</p>
						</div>
					</div>
				</div>
			</Card>
		</>
	);
};

export default React.memo(GeneralMessageDataCardComponent); // Wrap with React.memo
