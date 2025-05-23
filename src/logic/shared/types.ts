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
const FileSchema = z.object({
	path: z.string(),
	content: z.string(),
	type: ItemTypeEnum,
	target: z.string().optional(), // added conditionally below
})

/* ------------------------------------------------------------- */
/* 3. Shared "base" for every registry item                       */
/* ------------------------------------------------------------- */
const BaseItemSchema = z.object({
	/* static */
	$schema: z
		.literal('https://ui.shadcn.com/schema/registry-item.json')
		.default('https://ui.shadcn.com/schema/registry-item.json')
		.optional(),

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

/* ---------- simple types ------------------------------------------------- */

export const SimpleTypeSchema = z.union([
	z.literal('text'),
	z.literal('number'),
	z.literal('boolean'),
	z.literal('enum'),
	z.literal('object'),
	z.literal('unknown'),
])
export type SimpleType = z.infer<typeof SimpleTypeSchema>

const Required = z.boolean().default(false).optional()

/**
 * A mixed-literal value (string | number | boolean).
 * We use this union repeatedly for the enum support.
 */
const Literal = z.union([z.string(), z.number(), z.boolean()])

/* ---------- leaf fields ------------------------------------------------ */

const TextSimplePropSchema = z.object({
	type: z.literal('text'),
	required: Required,
	default: z.string().optional(),
})

const NumberSimplePropSchema = z.object({
	type: z.literal('number'),
	required: Required,
	default: z.number().optional(),
})

const BooleanSimplePropSchema = z.object({
	type: z.literal('boolean'),
	required: Required,
	default: z.boolean().optional(),
})

/* ---------- enum field ------------------------------------------------- */

const EnumSimplePropSchema = z.object({
	type: z.literal('enum'),
	required: Required,
	values: z.array(Literal).min(1), // at least one allowed literal
	default: Literal.optional(),
})

/* ---------- recursive object field ------------------------------------ */

// Done to help z.lazy() below be typed correctly
type SimplePropInternal = {
	type: 'text' | 'number' | 'boolean' | 'enum' | 'object' | 'unknown'
	required?: boolean
	default?: string | number | boolean | Record<string, any>
	values?: (string | number | boolean)[]
	properties?: Record<string, SimpleProp>
}

export const SimplePropSchema: z.ZodType<SimplePropInternal> = z.lazy(() =>
	z.union([
		TextSimplePropSchema,
		NumberSimplePropSchema,
		BooleanSimplePropSchema,
		EnumSimplePropSchema,
		ObjectSimplePropSchema,
	]),
)

export const ObjectSimplePropSchema = z.object({
	type: z.literal('object'),
	required: Required,
	properties: z.record(z.string(), SimplePropSchema), // recursion point
	default: z.any().optional(), // rarely useful, but allowed
})

/* ---------- union + top-level schema ---------------------------------- */

export const SimplePropsRecordSchema = z.record(z.string(), SimplePropSchema) // { [fieldName]: Field }

/* ---------- TypeScript types ------------------------------------------ */

export type SimpleProp = z.infer<typeof SimplePropSchema>
export type SimplePropsRecord = z.infer<typeof SimplePropsRecordSchema>
