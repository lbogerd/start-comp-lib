'use client'

import { createFileRoute } from '@tanstack/react-router'
import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'

import { Loader2, Monitor } from 'lucide-react'
import { ErrorBoundary } from '~/libs/internal/component/component-error-boundary'
import { CodeDisplay } from '~/libs/internal/ui/code-display'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/libs/kyc/ui/dropdown-menu'
import { getLibsServerFn } from '~/logic/server/server-functions/libs'

export const Route = createFileRoute('/_app/libs/$libName/$compType/$compName')({
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
	const [selectedBreakpoint, setSelectedBreakpoint] =
		useState<string>('responsive')

	const breakpoints = [
		{ label: 'Responsive', value: 'responsive', class: 'w-full max-w-full' },
		{ label: 'Small (640px)', value: 'sm', class: 'w-full max-w-sm mx-auto' },
		{ label: 'Medium (768px)', value: 'md', class: 'w-full max-w-md mx-auto' },
		{ label: 'Large (1024px)', value: 'lg', class: 'w-full max-w-lg mx-auto' },
		{ label: 'XL (1280px)', value: 'xl', class: 'w-full max-w-xl mx-auto' },
		{ label: '2XL (1536px)', value: '2xl', class: 'w-full max-w-2xl mx-auto' },
	]

	const currentBreakpoint = breakpoints.find(
		(bp) => bp.value === selectedBreakpoint,
	)

	useEffect(() => {
		setIsLoading(true)

		import(
			`../libs/${decodeURIComponent(params.libName)}/${decodeURIComponent(params.compType)}/${decodeURIComponent(params.compName)}.tsx`
		)
			.then((mod) => {
				setCmp(() => {
					return Object.entries(mod)
						.filter(
							([_, value]) =>
								typeof value === 'function' && /^[A-Z]/.test(value.name),
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
			<div className="mx-auto max-w-6xl">
				<h1 className="pl-2 text-2xl font-bold">{params.compName}</h1>
				{data.description && (
					<p className="pb-4 pl-2 text-neutral-500 dark:text-neutral-300">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in
						imperdiet lacus. Cras lacinia, ligula sed mollis mattis, metus
						turpis pretium turpis, id porta orci lorem ac lorem.
					</p>
				)}

				<div className="flex items-center justify-between pb-2 pl-2">
					<h3 className="text-lg font-bold">Preview</h3>
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700">
							<Monitor className="size-4" />
							{currentBreakpoint?.label}
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{breakpoints.map((breakpoint) => (
								<DropdownMenuItem
									key={breakpoint.value}
									onClick={() => setSelectedBreakpoint(breakpoint.value)}
									className={
										selectedBreakpoint === breakpoint.value
											? 'bg-neutral-100 dark:bg-neutral-700'
											: ''
									}
								>
									{breakpoint.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div
					id="component-container"
					className={`flex min-h-96 resize flex-col overflow-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900 ${currentBreakpoint?.class}`}
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
