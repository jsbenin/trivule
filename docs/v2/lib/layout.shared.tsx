import { Logo } from '@/components/logo';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: (
				<>
					<Logo size={24} />
					Trivule
				</>
			),
		},
		// see https://fumadocs.dev/docs/ui/navigation/links
		links: [],
	};
}
