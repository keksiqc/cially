import { MessageCircle, UsersRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import BottomCard from "./_main-components/bottom-card";
import { Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


export default function GeneralActivityData({ chartData }) {

	if (!chartData) {
		return (
			<>
				<Card className="mt-10 grid  auto-rows-auto px-10 sm:min-w-dvh">
					<div>
						<div className="text-xl font-semibold"><Activity className="inline mr-2" />General Data</div>
						<div className="font-sans text-sm mt-1 text-white/60">More insights regarding guild's activity</div>
					</div>
					<Skeleton className="w-full h-15" />


				</Card>
			</>
		)
	}

	let ArrayChartData = Array(chartData)[0]
	console.log(ArrayChartData)


	return (
		<>
			<Card className="mt-10 grid  auto-rows-auto px-10 sm:min-w-dvh">
				<div>
					<div className="text-xl font-semibold"><Activity className="inline mr-2" />General Data</div>
					<div className="font-sans text-sm mt-1 text-white/60">More insights regarding guild's activity</div>
				</div>
				<div className="grid grid-cols-2 ">
					<div className="">
						<div>Total Members:  <p className="inline text-white/80 font-sans">{ArrayChartData[0].total}</p></div>
						<div>Online Members:  <p className="inline text-white/80 font-sans">{ArrayChartData[0].online}</p></div>

					</div>
					<div>
						<div>Idle Members:  <p className="inline text-white/80 font-sans">{ArrayChartData[0].idle}</p></div>
						<div>Offline Members:  <p className="inline text-white/80 font-sans">{ArrayChartData[0].offline}</p></div>

					</div>
				</div>


			</Card>
		</>
	);
}
