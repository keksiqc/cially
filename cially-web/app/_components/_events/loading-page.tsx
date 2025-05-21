export default function LoadingPage() {
	return (
		<>
			<div className="mt-30 w-30 place-self-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 44 44"
					role="img"
					aria-label="Loading animation"
				>
					<title>Loading animation</title>
					<g fill="none" stroke="#ad023e" strokeWidth="2">
						<circle cx="22" cy="22" r="1">
							<animate
								attributeName="r"
								begin="0s"
								dur="1.8s"
								values="1; 20"
								calcMode="spline"
								keyTimes="0; 1"
								keySplines="0.165, 0.84, 0.44, 1"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="stroke-opacity"
								begin="0s"
								dur="1.8s"
								values="1; 0"
								calcMode="spline"
								keyTimes="0; 1"
								keySplines="0.3, 0.61, 0.355, 1"
								repeatCount="indefinite"
							/>
						</circle>
						<circle cx="22" cy="22" r="1">
							<animate
								attributeName="r"
								begin="-0.9s"
								dur="1.8s"
								values="1; 20"
								calcMode="spline"
								keyTimes="0; 1"
								keySplines="0.165, 0.84, 0.44, 1"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="stroke-opacity"
								begin="-0.9s"
								dur="1.8s"
								values="1; 0"
								calcMode="spline"
								keyTimes="0; 1"
								keySplines="0.3, 0.61, 0.355, 1"
								repeatCount="indefinite"
							/>
						</circle>
					</g>
				</svg>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 44 44"
					role="img"
					aria-label="Inner loading animation"
				>
					<title>Inner loading animation</title>
					<g fill="none" stroke="#ad023e" strokeWidth="2">
						<circle cx="22" cy="22" r="1">
							<animate
								attributeName="r"
								begin="0s"
								dur="1.8s"
								values="1; 20"
								calcMode="spline"
								keyTimes="0; 1"
								keySplines="0.165, 0.84, 0.44, 1"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="stroke-opacity"
								begin="0s"
								dur="1.8s"
								values="1; 0"
								calcMode="spline"
								keyTimes="0; 1"
								keySplines="0.3, 0.61, 0.355, 1"
								repeatCount="indefinite"
							/>
						</circle>
						<circle cx="22" cy="22" r="1">
							<animate
								attributeName="r"
								begin="-0.9s"
								dur="1.8s"
								values="1; 20"
								calcMode="spline"
								keyTimes="0; 1"
								keySplines="0.165, 0.84, 0.44, 1"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="stroke-opacity"
								begin="-0.9s"
								dur="1.8s"
								values="1; 0"
								calcMode="spline"
								keyTimes="0; 1"
								keySplines="0.3, 0.61, 0.355, 1"
								repeatCount="indefinite"
							/>
						</circle>
					</g>
				</svg>
			</div>
			<div className="text-center text-2xl">Loading...</div>
		</>
	);
}
