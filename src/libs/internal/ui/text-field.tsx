import { ComponentProps } from 'react'
import { Input } from './input'

export function TextField({
	label,
	...props
}: { label: string } & ComponentProps<typeof Input>) {
	return (
		<>
			<label htmlFor="text-field">{label}</label>
			<Input type="text" id="text-field" {...props} />
		</>
	)
}
