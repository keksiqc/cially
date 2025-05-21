import { UsersRound } from "lucide-react";
import React from "react"; // Import React for React.memo
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const MemberBlockComponent = ({ guild }) => {
	// Renamed for clarity
	return (
		<>
			<Card className="">
				<CardHeader>
					<CardTitle className="text-sm">
						<UsersRound className="-translate-y-0.5 mr-2 inline" />
						Current Members
					</CardTitle>
					<CardDescription className="text-2xl text-gray-300">
						{guild.members}
						<div className="mt-2 text-red-400 text-xs">
							{/* -5 than yesterday */}
						</div>
					</CardDescription>
				</CardHeader>
			</Card>
		</>
	);
};

export default React.memo(MemberBlockComponent); // Wrap with React.memo
