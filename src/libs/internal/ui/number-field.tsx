import { ComponentProps } from 'react'
import { Input } from './input'
import { AnyFieldApi } from '@tanstack/react-form'

export function NumberField({
	label,
	field,
	...props
}: { label: string; field: AnyFieldApi } & ComponentProps<typeof Input>) {
	const errors =
		field.state.meta.isTouched && field.state.meta.errors.length
			? field.state.meta.errors
			: undefined

	return (
		<>
			<label htmlFor={field.name}>{label}</label>

			<Input
				type="number"
				id={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.valueAsNumber)}
				{...props}
			/>

			{errors && (
				<ul>
					{errors.map((error) => (
						<li key={error.message}>{error.message}</li>
					))}
				</ul>
			)}
		</>
	)
}
