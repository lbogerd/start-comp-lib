import { createFileRoute } from '@tanstack/react-router'
import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'

import { Loader2 } from 'lucide-react'
import { ErrorBoundary } from '~/components/ComponentErrorBoundary'
import { CodeDisplay } from '~/libs/internal/ui/code-display'
import { getLibsServerFn } from '~/logic/server/server-functions/libs'

// Pre-load all component files using Vite's import.meta.glob
// This ensures all components are included in the production build
const componentModules = import.meta.glob('../libs/*/*/**.tsx', {
	eager: false,
})

export const Route = createFileRoute('/libs/$libName/$compType/$compName')({
	loader: async ({ params }) => {
		return (await getLibsServerFn())
			.find((lib) => lib.name === params.libName)
			?.items.find((item) => item.name === params.compName)
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

		// Construct the module path
		const modulePath = `../libs/${decodeURIComponent(params.libName)}/${decodeURIComponent(params.compType)}/${decodeURIComponent(params.compName)}.tsx`

		// Find the matching module in our pre-loaded glob
		const moduleLoader = componentModules[modulePath]

		if (!moduleLoader) {
			console.error(`Component module not found: ${modulePath}`)
			setIsLoading(false)
			return
		}

		// Load the component module
		moduleLoader()
			.then((mod) => {
				setCmp(() => {
					return Object.entries(mod as Record<string, unknown>)
						.filter(
							([_, value]) =>
								typeof value === 'function' &&
								/^[A-Z]/.test((value as Function).name),
						)
						.map(([_, component]) => component as ComponentType<any>)
				})
			})
			.catch((error) => {
				console.error('Failed to load component:', error)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [params.libName, params.compName, params.compType])

	return (
		data && (
			<div className="mx-auto max-w-2xl">
				<h1 className="pl-2 text-2xl font-bold">{params.compName}</h1>
				{data.description && (
					<p className="pb-4 pl-2 text-neutral-500 dark:text-neutral-300">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in
						imperdiet lacus. Cras lacinia, ligula sed mollis mattis, metus
						turpis pretium turpis, id porta orci lorem ac lorem.
					</p>
				)}

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

				{data.files?.map((file) => (
					<CodeDisplay key={file.path} title={file.path}>
						{file.content}
					</CodeDisplay>
				))}

				{data.docs && (
					<CodeDisplay title="Documentation">{data.docs}</CodeDisplay>
				)}
			</div>
		)
	)
}
