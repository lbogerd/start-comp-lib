import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { DefaultCatchBoundary } from './libs/internal/components/default-catch-boundary'
import { NotFound } from './libs/internal/components/not-found'
import { routeTree } from './routeTree.gen'

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		defaultPreload: 'intent',
		defaultErrorComponent: DefaultCatchBoundary,
		defaultNotFoundComponent: () => <NotFound />,
		scrollRestoration: true,
	})

	return router
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof createRouter>
	}
}
