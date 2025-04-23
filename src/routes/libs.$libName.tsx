import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { getLibComps } from '~/logic/server/libs'

export const Route = createFileRoute('/libs/$libName')({
	loader: async ({ params: { libName } }) => {
		return await getLibComps({ data: libName })
	},
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<h1>Lib: {Route.useParams().libName}</h1>
			<Outlet />
		</div>
	)
}
