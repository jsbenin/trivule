import Image from "next/image";

export function Logo({ className, size = 128, }: { className?: string; size?: number }) {
	return (
		<Image
			src="/icon.svg"
			alt="Trivule Logo"
			className={className}
			width={size}
			height={size}
		/>
	);
}
