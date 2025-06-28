import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Sidebar } from '~/libs/internal/ui/sidebar'
import { Suspense } from 'react'
import { SidebarSkeleton } from '~/libs/internal/ui/sidebar'
import { getLibsServerFn } from '~/logic/server/server-functions/libs'
import { ItemType } from '~/logic/shared/types'

export const Route = createFileRoute('/_app')({
	component: RouteComponent,
	loader: async () => {
		return await getLibsServerFn()
	},
})

function RouteComponent() {
	return (
		<>
			<Suspense fallback={<SidebarSkeleton className="w-48" />}>
				<Sidebar
					className="w-48"
					libs={Route.useLoaderData().map((lib) => ({
						name: lib.name,
						items: lib.items.map((item) => ({
							name: item.name,
							compType: item.type.replace('registry:', '') as ItemType,
						})),
					}))}
				/>
			</Suspense>
			<Outlet />
		</>
	)
}
