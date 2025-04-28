import { createFileRoute } from '@tanstack/react-router'
import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'
import { getComp } from '~/logic/server/comps'

import { ComponentDoc } from 'react-docgen-typescript'
import { Form, useForm } from 'react-hook-form'
import { CodeDisplay } from '~/components/libs/internal/code-display'
import { PropField } from '~/components/libs/internal/prop-field'

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

	const form = useForm({
		defaultValues: {
			children: 'Lorem ipsum dolor sit amet',
		},
	})

	const [Cmp, setCmp] = useState<ComponentType<any>[] | null>(null)
	const [componentPropValues, setComponentPropValues] = useState<any>({})
	const [isLoading, setIsLoading] = useState(true)

	// Use watch to subscribe to all form changes
	const watchedValues = form.watch()

	// Fix: Only update componentPropValues when watchedValues actually changes
	// This prevents infinite re-renders
	useEffect(() => {
		// Using a functional update to ensure we're not causing unnecessary updates
		setComponentPropValues((prev: any) => {
			// Only update if values are different
			if (JSON.stringify(prev) === JSON.stringify(watchedValues)) {
				return prev;
			}

			return watchedValues;
		});
	}, [watchedValues])

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

			<div>
				<Form {...form}>

						{JSON.parse(data.docs).map((doc: ComponentDoc) => (
							<>
								<pre>{JSON.stringify(doc, null, 2)}</pre>
								<PropField
									key="children"
									meta={{
										name: 'children',
										type: { name: 'string' },
										required: false,
										description: '',
										defaultValue: undefined,
									}}
									control={form.control}
								/>
								{Object.keys(doc.props).map((prop: string) => (
									<PropField
										key={prop}
										meta={doc.props[prop]}
										control={form.control}
									/>
								))}
							</>
						))}

				</Form>
			</div>
			{Cmp && !isLoading ? (
				Cmp.map((Cmp, index) => <Cmp key={index} {...componentPropValues} />)
			) : (
				<span>Loading...</span>
			)}
		</div>
	)
}
