import { z } from 'zod'

/* ------------------------------------------------------------- */
/* 1. Enumerations                                                */
/* ------------------------------------------------------------- */
export const FileTypeEnum = z.enum([
	'registry:lib',
	'registry:block',
	'registry:component',
	'registry:ui',
	'registry:hook',
	'registry:theme',
	'registry:page',
	'registry:file',
])

export const ItemTypeEnum = z.union([FileTypeEnum, z.literal('registry:style')])
export type ItemType = z.infer<typeof ItemTypeEnum>

/* ------------------------------------------------------------- */
/* 2. File schema (discriminated on `type`)                       */
/* ------------------------------------------------------------- */
const FileBaseSchema = z.object({
	path: z.string(),
	content: z.string(),
	type: FileTypeEnum,
	target: z.string().optional(), // added conditionally below
})

const PageOrFile = z.union([
	z.literal('registry:page'),
	z.literal('registry:file'),
])

export const FileSchema = FileBaseSchema.superRefine((file, ctx) => {
	if (PageOrFile.safeParse(file.type).success && !file.target) {
		ctx.addIssue({
			code: 'custom',
			message:
				"`target` is required when file.type is 'registry:page' or 'registry:file'",
			path: ['target'],
		})
	}
})

export type File = z.infer<typeof FileSchema>

/* ------------------------------------------------------------- */
/* 3. Shared "base" for every registry item                       */
/* ------------------------------------------------------------- */
const BaseItemSchema = z.object({
	/* required */
	name: z.string(),
	type: ItemTypeEnum,

	/* optional shared props */
	description: z.string().optional(),
	title: z.string().optional(),
	author: z.string().optional(),

	dependencies: z.array(z.string()).optional(),
	devDependencies: z.array(z.string()).optional(),
	registryDependencies: z.array(z.string()).optional(),

	files: z.array(FileSchema).optional(),

	cssVars: z
		.object({
			theme: z.record(z.string(), z.string()).optional(),
			light: z.record(z.string(), z.string()).optional(),
			dark: z.record(z.string(), z.string()).optional(),
		})
		.partial()
		.optional(),

	css: z.record(z.string(), z.string()).optional(),

	meta: z.record(z.string(), z.string()).optional(),
	docs: z.string().optional(),
	categories: z.array(z.string()).optional(),
})

/* ------------------------------------------------------------- */
/* 4. Per-type extensions                                         */
/* ------------------------------------------------------------- */
const LibSchema = BaseItemSchema.extend({ type: z.literal('registry:lib') })
const BlockSchema = BaseItemSchema.extend({ type: z.literal('registry:block') })
const ComponentSchema = BaseItemSchema.extend({
	type: z.literal('registry:component'),
})
const UiSchema = BaseItemSchema.extend({ type: z.literal('registry:ui') })
const HookSchema = BaseItemSchema.extend({ type: z.literal('registry:hook') })
const ThemeSchema = BaseItemSchema.extend({ type: z.literal('registry:theme') })
const PageSchema = BaseItemSchema.extend({ type: z.literal('registry:page') })
const FileItemSchema = BaseItemSchema.extend({
	type: z.literal('registry:file'),
})

/* registry:style gets the extra `extends` field */
const StyleSchema = BaseItemSchema.extend({
	type: z.literal('registry:style'),
	extends: z.string().optional(), // "none" can still be expressed as the literal string "none"
})

/* ------------------------------------------------------------- */
/* 5. Discriminated-union of all items                            */
/* ------------------------------------------------------------- */
export const RegistryItemSchema = z.discriminatedUnion('type', [
	LibSchema,
	BlockSchema,
	ComponentSchema,
	UiSchema,
	HookSchema,
	ThemeSchema,
	PageSchema,
	FileItemSchema,
	StyleSchema,
])

export type RegistryItem = z.infer<typeof RegistryItemSchema>

export const RegistrySchema = z.object({
	name: z.string().meta({
		title: 'Registry Name',
		description:
			'The name of the registry. This is used for data attributes and other metadata.',
		example: 'acme',
	}),
	homepage: z.url().meta({
		title: 'Homepage',
		description:
			'The homepage of the registry. This is used for data attributes and other metadata.',
		example: 'http://localhost:3000/libs/acme',
	}),
	items: z.array(RegistryItemSchema).meta({
		title: 'Items',
		description:
			'The items in the registry. Each item must implement the registry-item schema specification.',
	}),
})

export type Registry = z.infer<typeof RegistrySchema>
