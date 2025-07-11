import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { DefaultCatchBoundary } from './libs/internal/component/default-catch-boundary'
import { NotFound } from './libs/internal/component/not-found'
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
