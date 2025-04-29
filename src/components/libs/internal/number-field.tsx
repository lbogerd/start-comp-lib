import { ComponentProps } from 'react'
import { Input } from './input'

export function NumberField({
	label,
	...props
}: { label: string } & ComponentProps<typeof Input>) {
	return (
		<>
			<label htmlFor="number-field">{label}</label>
			<Input type="number" id="number-field" {...props} />
		</>
	)
}
