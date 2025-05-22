import { SelectValue } from '@radix-ui/react-select'
import { z } from 'zod'
import { Checkbox } from '~/libs/new-york/ui/checkbox'
import { Input } from '~/libs/new-york/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '~/libs/new-york/ui/select'
import Button from '../ui/button'

/* ---------- helpers ---------------------------------------------------- */

const Required = z.boolean().optional() // shared “required” flag

/**
 * A mixed-literal value (string | number | boolean).
 * We use this union repeatedly for the enum support.
 */
const Literal = z.union([z.string(), z.number(), z.boolean()])

/* ---------- leaf fields ------------------------------------------------ */

const TextField = z.object({
	type: z.literal('text'),
	required: Required,
	default: z.string().optional(),
})

const NumberField = z.object({
	type: z.literal('number'),
	required: Required,
	default: z.number().optional(),
})

const BooleanField = z.object({
	type: z.literal('boolean'),
	required: Required,
	default: z.boolean().optional(),
})

/* ---------- enum field ------------------------------------------------- */

const EnumField = z.object({
	type: z.literal('enum'),
	required: Required,
	values: z.array(Literal).min(1), // at least one allowed literal
	default: Literal.optional(),
})

/* ---------- recursive object field ------------------------------------ */

type Field = {
	type: 'text' | 'number' | 'boolean' | 'enum' | 'object'
	required?: boolean
	default?: string | number | boolean | Record<string, any>
	values?: (string | number | boolean)[]
	properties?: Record<string, Field>
}

const FieldSchema: z.ZodType<Field> = z.lazy(() =>
	z.union([TextField, NumberField, BooleanField, EnumField, ObjectField]),
)

const ObjectField = z.object({
	type: z.literal('object'),
	required: Required,
	properties: z.record(z.string(), FieldSchema), // recursion point
	default: z.any().optional(), // rarely useful, but allowed
})

/* ---------- union + top-level schema ---------------------------------- */

export const Field = FieldSchema // handy re-export

export const Schema = z.record(z.string(), Field) // { [fieldName]: Field }

/* ---------- TypeScript types ------------------------------------------ */

export type FieldDesc = z.infer<typeof Field>
export type FormSchema = z.infer<typeof Schema>

export function DynamicForm({
	schema,
	asForm = true,
}: {
	schema: FormSchema
	asForm?: boolean
}) {
	const EmptyForm = ({
		action,
		children,
	}: {
		children: React.ReactNode
		action: (f: FormData) => void
	}) => {
		return <form action={action}>{children}</form>
	}

	const FormFields = () => {
		return (
			<>
				{Object.entries(schema).map(([key, field]) => {
					const label = (
						<label
							htmlFor={key}
							className="block text-sm font-medium text-gray-700"
						>
							{key}
						</label>
					)

					switch (field.type) {
						case 'text':
							return (
								<div key={key}>
									{label}
									<Input
										id={key}
										name={key}
										defaultValue={field.default?.toString() ?? ''}
									/>
								</div>
							)

						case 'number':
							return (
								<div key={key}>
									{label}
									<Input
										id={key}
										type="number"
										name={key}
										defaultValue={field.default?.toString() ?? ''}
									/>
								</div>
							)

						case 'boolean':
							return (
								<div key={key}>
									{label}
									<Checkbox
										id={key}
										name={key}
										defaultChecked={field.default as boolean}
									/>
								</div>
							)

						case 'enum':
							return (
								<div key={key}>
									{label}
									<Select name={key} defaultValue={field.default?.toString()}>
										<SelectTrigger>
											<SelectValue placeholder={'Select an option'} />
										</SelectTrigger>

										<SelectContent>
											{field.values?.map((v: any) => (
												<SelectItem key={String(v)} value={String(v)}>
													{String(v)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							)

						case 'object':
							return (
								<fieldset key={key} style={{ marginBottom: 12 }}>
									<legend>{key}</legend>
									<DynamicForm asForm={false} schema={field.properties!} />
								</fieldset>
							)

						default:
							return (
								// should never happen but let's add a textarea for safety
								<div key={key}>
									{label}
									<textarea
										id={key}
										name={key}
										defaultValue={field.default?.toString() ?? ''}
									/>
								</div>
							)
					}
				})}
			</>
		)
	}

	return (
		<>
			{asForm ? (
				<EmptyForm
					action={(f) =>
						window.alert(JSON.stringify(Object.fromEntries(f), null, 2))
					}
				>
					<FormFields />
					<Button type="submit">Submit</Button>
				</EmptyForm>
			) : (
				<FormFields />
			)}
		</>
	)
}

const schema: FormSchema = {
	name: { type: 'text', required: true },
	age: { type: 'number', required: true },
	isActive: { type: 'boolean', default: true },
	role: {
		type: 'enum',
		values: ['admin', 'user', 'guest'],
		default: 'user',
	},
	address: {
		type: 'object',
		properties: {
			street: { type: 'text', default: '123 Main St' },
			city: { type: 'text', required: true },
		},
	},
}

export function ExampleForm() {
	return <DynamicForm schema={schema} />
}
