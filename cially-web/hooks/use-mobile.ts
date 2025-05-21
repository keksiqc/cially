import * as React from "react";

const TAILWIND_MD_BREAKPOINT_PX = 768; // More descriptive name

export function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
		undefined, // Initial undefined state is fine, !!isMobile will handle it.
	);

	React.useEffect(() => {
		const mql = window.matchMedia(
			`(max-width: ${TAILWIND_MD_BREAKPOINT_PX - 1}px)`,
		);
		const onChange = () => {
			setIsMobile(window.innerWidth < TAILWIND_MD_BREAKPOINT_PX);
		};

		onChange(); // Set initial state

		mql.addEventListener("change", onChange);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	return !!isMobile; // Returns false if undefined, which is acceptable for initial render.
}
