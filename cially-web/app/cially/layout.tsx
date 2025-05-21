import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/_shadcn/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar isGuild={false} />
			<SidebarInset className="h-full overflow-auto bg-transparent">
				<main>
					<SidebarTrigger className="sm:hidden" />
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
