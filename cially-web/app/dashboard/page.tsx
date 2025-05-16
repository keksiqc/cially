import BottomCard from "./_main-components/bottom-card";
import MemberBlock from "./_main-components/member-card";
import MessagesBlock from "./_main-components/messages-card";

const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

export default async function Dashboard({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const guildID = (await searchParams).guildID;

	const API_REQ = await fetch(`${WEBSITE_URL}/api/server/${guildID}/fetchGuild`);
	const data = await API_REQ.json();

	const guild = data.guildFound[0];
	const date = new Date();
	const new_date = date.toLocaleString("en-US");
	const welcome_message = String(new_date).includes("AM")
		? "Good Morning"
		: "Good Evening";

	return (
		<>
			<div className="mt-10 mr-4 ml-10 grid grid-rows-3 sm:min-w-dvh sm:grid-rows-none">
				<div>
					<div className="rows-span-1 grid grid-rows-3 sm:grid-cols-8 sm:grid-rows-none ">
						<div className="text-4xl sm:col-span-2 ">
							{welcome_message}
							<div className="mt-2 font-normal text-gray-400 text-xs">
								Currently viewing {guild.name}
							</div>
						</div>
						<div className="mr-4 sm:col-span-2 sm:col-start-4">
							<MemberBlock guild={guild} />
						</div>
						<div className="mr-4 sm:col-span-2 sm:col-start-6">
							<MessagesBlock guild={guild} />
						</div>
					</div>
				</div>

				<div className="row-span-3 sm:row-span-1">
					<BottomCard guild={guild} />
					<div className="mt-5 pb-5 text-center text-gray-600 text-xs">
						Thanks for using Cially Dashboard!
					</div>
				</div>
			</div>
		</>
	);
}
