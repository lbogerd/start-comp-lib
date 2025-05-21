import { zodResolver } from '@hookform/resolvers/zod'
import React, { JSX } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import {
	z,
	ZodLiteral,
	ZodObject,
	ZodOptional,
	ZodTypeAny,
	ZodUnion,
} from 'zod'

/**
 * Public wrapper
 */
export function DynamicForm<T extends ZodObject<any>>({
	schema,
	onSubmit,
}: {
	schema: T
	onSubmit: (data: z.infer<T>) => void
}) {
	const methods = useForm<z.infer<T>>({
		resolver: zodResolver(schema),
		defaultValues: undefined,
	})

	return (
		<FormProvider<z.infer<T>> {...methods}>
			<form
				onSubmit={methods.handleSubmit(onSubmit)}
				className="max-w-xl space-y-4"
			>
				<RenderSchema schema={schema} />
				<button
					type="submit"
					className="rounded bg-blue-600 px-4 py-2 text-white"
				>
					Submit
				</button>
			</form>
		</FormProvider>
	)
}

/**
 * Recursively render any Zod node
 */
function RenderSchema({
	schema,
	path = '',
}: {
	schema: ZodTypeAny
	path?: string
}): JSX.Element {
	const kind = schema.def.type

	switch (kind) {
		/* ────────── Objects ────────── */
		case 'object': {
			const entries = (schema as ZodObject<any>).shape
			return (
				<>
					{Object.entries(entries).map(([key, sub]) => (
						<RenderSchema
							key={key}
							schema={sub as z.ZodType<unknown, unknown>}
							path={path ? `${path}.${key}` : key}
						/>
					))}
				</>
			)
		}

		/* ────────── Scalars ────────── */
		case 'string':
			return <InputText name={path} />

		case 'number':
			return <InputNumber name={path} />

		/* ────────── Literal unions ⇢ <select> ────────── */
		case 'union': {
			const literals = (schema as ZodUnion<any>).options as ZodLiteral<any>[]
			if (literals.every((l) => l.def.type === 'literal')) {
				return (
					<InputSelect
						name={path}
						options={literals.map((l) => String(l.def.values))}
					/>
				)
			}
			return <Unsupported path={path} detail="Complex union" />
		}

		/* ────────── Optional wrapper ────────── */
		case 'optional':
			return (
				<RenderSchema
					schema={(schema as ZodOptional<any>).unwrap()}
					path={path}
				/>
			)

		default:
			return <Unsupported path={path} detail={kind} />
	}
}

/* ---------------------------------------------------------------- */
/* 🖼️  Field primitives – swap out for your design system           */
/* ---------------------------------------------------------------- */

function Field({
	label,
	children,
}: {
	label: string
	children: React.ReactNode
}) {
	return (
		<div className="flex flex-col gap-1">
			<label className="font-medium capitalize">{label}</label>
			{children}
		</div>
	)
}

function InputText({ name }: { name: string }) {
	const { register } = useFormContext()
	return (
		<Field label={name}>
			<input
				{...register(name)}
				type="text"
				className="w-full rounded border px-2 py-1"
			/>
		</Field>
	)
}

function InputNumber({ name }: { name: string }) {
	const { register } = useFormContext()
	return (
		<Field label={name}>
			<input
				{...register(name, { valueAsNumber: true })}
				type="number"
				className="w-full rounded border px-2 py-1"
			/>
		</Field>
	)
}

function InputSelect({ name, options }: { name: string; options: string[] }) {
	const { register } = useFormContext()
	return (
		<Field label={name}>
			<select {...register(name)} className="w-full rounded border px-2 py-1">
				<option value="">— choose —</option>
				{options.map((opt) => (
					<option key={opt}>{opt}</option>
				))}
			</select>
		</Field>
	)
}

function Unsupported({ path, detail }: { path: string; detail: string }) {
	return (
		<div>
			<h3>Unsupported!</h3>
			<div>path: {path}</div>
			<div>detail: {detail}</div>
		</div>
	)
}

const userSchema = z.object({
	name: z.string(),
	age: z.number(),
	role: z.union([
		z.literal('unauthenticated'),
		z.literal('user'),
		z.literal('admin'),
	]),
	address: z.object({
		street: z.string(),
		houseNumber: z.number().default(14),
		houseNumberAdditions: z.string().optional(),
	}),
})

export default function ExampleForm() {
	return (
		<DynamicForm
			schema={userSchema}
			onSubmit={(values) => console.log(values)}
		/>
	)
}
