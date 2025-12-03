import Image from "next/image";

export function Logo({ className }: { className?: string }) {
	return (
		<Image
			src="/icon.svg"
			alt="Trivule Logo"
			className={className}
			width={128}
			height={128}
		/>
	);
}
