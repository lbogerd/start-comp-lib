interface BasePropsField {
	name: string
	type: PropsFieldType
	isRequired: boolean
	defaultValue?: string
}

export interface EnumPropsField extends BasePropsField {
	type: 'enum'
	enum: string[]
}

export interface ObjectPropsField extends BasePropsField {
	type: 'object'
	shape: Set<PropsField>
}

export interface PrimitivePropsField extends BasePropsField {
	type: 'text' | 'number' | 'date'
}

export type PropsField = PrimitivePropsField | EnumPropsField | ObjectPropsField

export type PropsFieldType = 'text' | 'number' | 'enum' | 'date' | 'object'

export function toProps(input: object): Set<PropsField> {
	const props = new Set<PropsField>()
	for (const [key, value] of Object.entries(input)) {
		if (typeof value === 'string') {
			props.add({
				name: key,
				type: 'text',
				isRequired: false,
			})
		} else if (typeof value === 'number') {
			props.add({
				name: key,
				type: 'number',
				isRequired: false,
			})
		} else if (Array.isArray(value)) {
			props.add({
				name: key,
				type: 'enum',
				enum: value,
				isRequired: false,
			})
		} else if (value instanceof Date) {
			props.add({
				name: key,
				type: 'date',
				isRequired: false,
			})
		} else if (typeof value === 'object') {
			props.add({
				name: key,
				type: 'object',
				isRequired: false,
				shape: toProps(value),
			})
		}
	}
	return props
}
