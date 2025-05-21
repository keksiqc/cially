"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ErrorUserCard() {
	return (
		<div className="mt-3 w-full place-self-center ">
			<Card className="mx-5">
				<CardHeader>
					<div className="grid grid-cols-2">
						<div className="place-self-start">
							<div className="grid grid-cols-2 gap-0">
								<Avatar className="h-[60px] w-[60px]">
									{" "}
									{/* Adjusted size */}
									<Skeleton className="w-full rounded-full " />
								</Avatar>
								<div className="place-self-center font-bold">
									<Skeleton className="h-[20px] w-[80px] rounded-xl " />{" "}
									{/* Adjusted size */}
								</div>
							</div>
						</div>
					</div>

					<hr className="my-3" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-[80px] w-full rounded-xl " />{" "}
					{/* Adjusted size */}
				</CardContent>
			</Card>
			<div className="mx-20 mt-5">
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						<p className="text-gray-500 text-xs">
							Could not find that user in the database!
						</p>
					</AlertDescription>
				</Alert>
			</div>
		</div>
	);
}
