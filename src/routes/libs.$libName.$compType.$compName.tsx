import { createFileRoute } from '@tanstack/react-router'
import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'
import { getComp } from '~/logic/server/comps'

import { Loader2 } from 'lucide-react'
import { ErrorBoundary } from '~/components/internal/error-boundary'
import { CodeDisplay } from '~/components/libs/internal/code-display'

export const Route = createFileRoute('/libs/$libName/$compType/$compName')({
	loader: async ({ params: { libName, compType, compName } }) => {
		return await getComp({
			data: `${decodeURIComponent(libName)}/${decodeURIComponent(compType)}/${decodeURIComponent(compName)}.tsx`,
		})
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

		import(
			`../libs/${decodeURIComponent(params.libName)}/${decodeURIComponent(params.compType)}/${decodeURIComponent(params.compName)}.tsx`
		)
			.then((mod) => {
				setCmp(() => {
					return Object.keys(mod).map((key) => mod[key])
				})
			})
			.catch((error) => {
				console.error('Failed to load component:', error)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [params.libName, params.compName])

	return (
		<div className="mx-auto max-w-2xl">
			<h1 className="pl-2 text-2xl font-bold">{params.compName}</h1>
			<p className="pb-4 pl-2 text-neutral-500 dark:text-neutral-300">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in imperdiet
				lacus. Cras lacinia, ligula sed mollis mattis, metus turpis pretium
				turpis, id porta orci lorem ac lorem.
			</p>

			<h3 className="pb-2 pl-2 text-lg font-bold">Preview</h3>
			<div
				id="component-container"
				className="flex min-h-96 w-full max-w-full resize flex-col overflow-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900"
			>
				{Cmp?.length && Cmp.length > 0 && !isLoading ? (
					Cmp.map((Cmp, index) => (
						<ErrorBoundary key={index} fallback={null}>
							<Cmp />
						</ErrorBoundary>
					))
				) : (
					<Loader2 className="m-auto size-10 animate-spin text-neutral-500 dark:text-neutral-400" />
				)}
			</div>

			<CodeDisplay>{data.sourceCode}</CodeDisplay>

			<CodeDisplay title="Docs">{data.docs}</CodeDisplay>
		</div>
	)
}
