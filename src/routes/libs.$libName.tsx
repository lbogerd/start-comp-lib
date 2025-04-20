import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { getLibComps } from '~/logic/server/libs'

export const Route = createFileRoute('/libs/$libName')({
	loader: async ({ params: { libName } }) => {
		return await getLibComps({ data: libName })
	},
	component: RouteComponent,
})

function RouteComponent() {
	const comps = Route.useLoaderData()
	const params = Route.useParams()

	return (
		<nav>
			{comps.map((comp) => (
				<Link
					to="/libs/$libName/$compName"
					params={{ libName: params.libName, compName: comp }}
				>
					{comp}
				</Link>
			))}
			<Outlet />
		</nav>
	)
}
