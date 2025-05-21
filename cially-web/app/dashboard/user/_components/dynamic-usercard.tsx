"use client";

import React from "react"; // Import React for React.memo
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const DynamicUserCardComponent = ({ userData }) => {
	// Renamed for clarity
	return (
		<div className="mt-10 w-full place-self-center ">
			<Card className="mx-5">
				<CardHeader>
					<div className="grid grid-cols-2">
						<div className="place-self-start">
							<div className="grid grid-cols-2 gap-0">
								<Avatar className="h-[60px] w-[60px]">
									{" "}
									{/* Adjusted size */}
									<AvatarImage src={userData[0].avatar} />
								</Avatar>
								<div className="place-self-center font-bold">
									{userData[0].username}
								</div>
							</div>
						</div>
					</div>

					<hr className="my-3" />
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-3">
						<div className="place-self-start">
							<div>
								Joins:{" "}
								<div className="inline text-gray-300">
									{userData[0].dataArray[0].totalJoins}
								</div>
							</div>
							<div>
								Leaves:{" "}
								<div className="inline text-gray-300">
									{userData[0].dataArray[0].totalLeaves}
								</div>
							</div>
							<div>
								Total Messages:{" "}
								<div className="inline text-gray-300">
									{userData[0].dataArray[0].totalMessages}
								</div>
							</div>
							<div>
								Creation Date:{" "}
								<div className="inline text-gray-300">
									{new Date(userData[0].creationDate).toLocaleDateString()} at{" "}
									{new Date(userData[0].creationDate).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
										second: "2-digit",
										timeZoneName: "shortOffset",
									})}
								</div>
							</div>
						</div>
						<div className="place-self-start">
							<div>
								Average Message Length:{" "}
								<div className="inline text-gray-300">
									{userData[0].dataArray[0].averageMessageLength}
								</div>
							</div>
							<div>
								Invites Created:{" "}
								<div className="inline text-gray-300">
									{userData[0].dataArray[0].totalInvites}
								</div>
							</div>
							<div>
								Most Active Channel:{" "}
								<div className="inline text-gray-300">
									{userData[0].dataArray[0].activeChannel &&
									userData[0].dataArray[0].activeChannel.length > 0
										? `#${userData[0].dataArray[0].activeChannel[0].channel}`
										: "N/A"}
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default React.memo(DynamicUserCardComponent); // Wrap with React.memo
