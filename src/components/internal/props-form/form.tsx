export type PropsField = {
	label: string
	name: string
	type: PropsFieldType
	value: string | number | boolean | Date
	onChange: (value: string | number | boolean | Date) => void
}

export type PropsFieldType =
	| 'text'
	| 'large-text'
	| 'number'
	| 'boolean'
	| 'enum'
