import { createFileRoute } from '@tanstack/react-router'
import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'
import { getComp } from '~/logic/server/comps'

import { ComponentDoc } from 'react-docgen-typescript'
import { CodeDisplay } from '~/components/libs/internal/code-display'

export const Route = createFileRoute('/libs/$libName/$compName')({
	loader: async ({ params: { libName, compName } }) => {
		console.log(`${libName}/${compName}`)

		return await getComp({ data: `${libName}/${compName}` })
	},
	component: RouteComponent,
})

function RouteComponent() {
	const params = Route.useParams()
	const data = Route.useLoaderData()

	const [Cmp, setCmp] = useState<ComponentType<any>[] | null>(null)
	const [isLoading, setIsLoading] = useState(true)


	useEffect(() => {
		setIsLoading(true)

		import(`../components/libs/${params.libName}/${params.compName}`)
			.then((mod) => {
				setCmp(() => {
					return Object.keys(mod).map((key) => mod[key])
				})
			})
			.catch((error) => {
				console.error("Failed to load component:", error)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [params.libName, params.compName])

	return (
		<div>
			<CodeDisplay>{data.sourceCode}</CodeDisplay>

			{Cmp && !isLoading ? (
				Cmp.map((Cmp, index) => <Cmp key={index} />)
			) : (
				<span>Loading...</span>
			)}
		</div>
	)
}
