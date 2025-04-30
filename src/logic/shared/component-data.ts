import { z } from 'zod'
import { readdir } from 'fs/promises'
import { docGenParser } from '../server/data/parsers'
import { PropItem, PropItemType } from 'react-docgen-typescript'
export const propTypeSchema = z.enum([
	'string',
	'number',
	'boolean',
	'object',
	'array',
	'date',
	'enum',
	'other',
])
export type PropType = z.infer<typeof propTypeSchema>

export const propDataSchema = z.object({
	name: z.string(),
	type: propTypeSchema,
	description: z.string(),
	defaultValue: z.string(),
	required: z.boolean(),
})
export type PropData = z.infer<typeof propDataSchema>

export const componentDataSchema = z.object({
	filePath: z.string(),
	displayName: z.string(),
	description: z.string(),
	props: z.array(propDataSchema),
})
export type ComponentData = z.infer<typeof componentDataSchema>

export const libraryDataSchema = z.object({
	filePath: z.string(),
	components: z.array(componentDataSchema),
})
export type LibraryData = z.infer<typeof libraryDataSchema>

function toPropType(type: PropItemType): PropType {
	const parsed = propTypeSchema.safeParse(type.name)

	if (!parsed.success) {
		return 'other'
	}

	return parsed.data
}

export function toPropData(prop: PropItem): PropData {
	return {
		name: prop.name,
		type: toPropType(prop.type),
		description: prop.description,
		defaultValue: prop.defaultValue,
		required: prop.required,
	}
}

export const getComponentData = async (
	filePath: string,
): Promise<ComponentData[]> => {
	const data = docGenParser.parse(filePath)

	const components: ComponentData[] = []
	for (const component of data) {
		components.push({
			filePath,
			displayName: component.displayName,
			description: component.description,
			props: Object.values(component.props).map(toPropData),
		})
	}

	return components
}

export const getLibraryData = async (
	filePath: string,
): Promise<LibraryData> => {
	const returnData: LibraryData = {
		filePath,
		components: [],
	}

	const files = await readdir(filePath)

	for (const file of files) {
		const componentData = await getComponentData(file)
		returnData.components.push(...componentData)
	}

	return returnData
}
