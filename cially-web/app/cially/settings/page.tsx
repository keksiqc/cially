"use client";

import { DatabaseBackup } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
	const router = useRouter();

	const [deleteStatus, setDeleteStatus] = useState("");

	const handleDelete = async () => {
		setDeleteStatus("Deleting...");

		try {
			const response = await fetch(`/api/cially/eraseDatabase`, {
				method: "DELETE",
			});

			if (response.ok) {
				setDeleteStatus("Item deleted successfully!");
				router.push("/");
			} else {
				const errorData = await response.json();
				setDeleteStatus(
					`Deletion failed: ${errorData?.message || "An error occurred"}`,
				);
			}
		} catch (error) {
			console.error("Error deleting item:", error);
			setDeleteStatus("Deletion failed due to a network error.");
		}
	};

	return (
		<div className="min-h-dvh min-w-full ">
			<div>
				<div className="mt-4 ml-2 text-2xl">Settings</div>
				<div className="mt-1 ml-2 text-sm text-white/50">
					Manage your dashboard settings and preferences
				</div>
			</div>

			<Card className="mt-10 w-[75%] border border-red-500/40">
				{" "}
				{/* Changed border-[1px] to border */}
				<CardHeader>
					<CardTitle>
						<DatabaseBackup className="-translate-y-0.5 mr-2 inline w-5" />{" "}
						Erase Database
					</CardTitle>
					<CardDescription>
						Click the button bellow to erase all the data in your database. This
						action is irreversible!
					</CardDescription>
				</CardHeader>
				<CardContent>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="destructive"
								className=" cursor-pointer place-self-center transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" // Simplified outline to standard focus ring
							>
								Erase
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This is a permanent action. Confirming will erase all server
									data, and this process cannot be reversed. Ensure you
									understand the implications before proceeding.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => handleDelete()}
									className="bg-red-600 text-white transition hover:bg-red-800"
								>
									Confirm
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</CardContent>
			</Card>
		</div>
	);
}
