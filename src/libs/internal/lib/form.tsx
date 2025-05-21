import { required, z } from 'zod'

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

const FieldSchema: z.ZodType<any> = z.lazy(() =>
	z.union([
		// reference back to itself for recursion
		TextField,
		NumberField,
		BooleanField,
		EnumField,
		ObjectField, // defined just below
	]),
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
	showSubmit = false,
}: {
	schema: FormSchema
	showSubmit?: boolean
}) {
	return (
		<form
			action={(f) =>
				window.alert(JSON.stringify(Object.fromEntries(f), null, 2))
			}
		>
			{Object.entries(schema).map(([key, field]) => {
				const label = (
					<label htmlFor={key} style={{ display: 'block', marginBottom: 4 }}>
						{key}
					</label>
				)

				switch (field.type) {
					case 'text':
						return (
							<div key={key}>
								{label}
								<input id={key} name={key} defaultValue={field.default ?? ''} />
							</div>
						)

					case 'number':
						return (
							<div key={key}>
								{label}
								<input
									id={key}
									type="number"
									name={key}
									defaultValue={field.default ?? ''}
								/>
							</div>
						)

					case 'boolean':
						return (
							<div key={key}>
								{label}
								<input
									id={key}
									type="checkbox"
									name={key}
									defaultChecked={field.default ?? false}
								/>
							</div>
						)

					case 'enum':
						return (
							<div key={key}>
								{label}
								<select id={key} name={key} defaultValue={field.default}>
									{field.values.map((v: any) => (
										<option key={String(v)} value={String(v)}>
											{String(v)}
										</option>
									))}
								</select>
							</div>
						)

					case 'object':
						return (
							<fieldset key={key} style={{ marginBottom: 12 }}>
								<legend>{key}</legend>
								<DynamicForm schema={field.properties} />
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
									defaultValue={field.default ?? ''}
								/>
							</div>
						)
				}
			})}
			{showSubmit && (
				<button type="submit" style={{ marginTop: 12 }}>
					Submit
				</button>
			)}
		</form>
	)
}

export function ExampleForm() {
	const schema = {
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

	return <DynamicForm showSubmit schema={schema} />
}
