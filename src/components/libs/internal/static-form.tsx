import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { NumberField } from './number-field'
import { z } from 'zod'

const { fieldContext, formContext } = createFormHookContexts()

const { useAppForm } = createFormHook({
	fieldComponents: {
		NumberField,
	},
	fieldContext,
	formContext,
	formComponents: {
		SubmitButton: () => <button type="submit">Submit</button>,
	},
})

export default function StaticForm() {
	const form = useAppForm({
		defaultValues: {
			nummer: 0,
		},
		validators: {
			onChange: z.object({
				nummer: z.number().min(12),
			}),
		},
		onSubmit: (data) => {
			alert(JSON.stringify(data.value, null, 2))
		},
	})

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				e.stopPropagation()

				form.handleSubmit()
			}}
		>
			<h1>Static Form</h1>

			<form.AppField
				name="nummer"
				children={(field) => (
					<field.NumberField label={field.name} field={field} />
				)}
			/>

			<form.SubmitButton />
		</form>
	)
}
