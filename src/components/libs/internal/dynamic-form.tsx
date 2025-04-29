import { createFormHookContexts, useForm } from '@tanstack/react-form'
// Form components that pre-bind events from the form hook; check our "Form Composition" guide for more
// We also support Valibot, ArkType, and any other standard schema library

const { fieldContext, formContext } = createFormHookContexts()

import { FieldInfo } from './field-info'
import { Input } from './input'
interface FormValues {
	username: string
	age: number
}

const defaultValues: FormValues = {
	username: '',
	age: 0,
}

export function DynamicForm() {
	const form = useForm({
		defaultValues,
		onSubmit: async ({ value }) => {
			// Do something with form data
			alert(JSON.stringify(value, null, 2))
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
			<h1>Personal Information</h1>

			<form.Field
				name="username"
				children={(field) => (
					<>
						<Input
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					</>
				)}
			/>

			<form.Field
				name="age"
				validators={{
					// We can choose between form-wide and field-specific validators
					onChange: ({ value }) =>
						value > 13 ? undefined : 'Must be 13 or older',
				}}
				children={(field) => (
					<>
						<input
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							type="number"
							onChange={(e) => field.handleChange(e.target.valueAsNumber)}
						/>
						<FieldInfo field={field} />
					</>
				)}
			/>

			<button
				type="submit"
				className="cursor-pointer rounded bg-blue-500 p-2 text-white"
			>
				Submit
			</button>
		</form>
	)
}
