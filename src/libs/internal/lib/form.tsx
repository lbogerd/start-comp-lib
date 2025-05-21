import { zodResolver } from '@hookform/resolvers/zod'
import React, { JSX, useMemo } from 'react'
import {
	DefaultValues,
	FormProvider,
	useForm,
	useFormContext,
} from 'react-hook-form'
import {
	output,
	z,
	ZodDefault,
	ZodLiteral,
	ZodObject,
	ZodOptional,
	ZodType,
	ZodTypeAny,
	ZodUnion,
} from 'zod'

/* ──────────────────────────────────────────────────────────── */
/* 🔧  helpers                                                 */
/* ──────────────────────────────────────────────────────────── */

/** Recursively strip ZodOptional / ZodDefault wrappers */
function unwrap(schema: ZodTypeAny): ZodTypeAny {
	// if (schema instanceof ZodOptional || schema instanceof ZodDefault) {
	// 	return unwrap(schema.def)
	// }
	return schema
}

/** Is the field optional from a *UI* standpoint? */
function isOptional(schema: ZodTypeAny): boolean {
	return schema instanceof ZodOptional || schema instanceof ZodDefault
}

/** Get default values defined with .default() anywhere in the schema */
function getDefaultValues<T extends ZodObject<any>>(schema: T): z.infer<T> {
	/*  Trick: make the entire schema optional, then parse an empty object.
      Zod pipes through default values wherever they exist. */
	return schema.partial().parse({}) as z.infer<T>
}

/* ──────────────────────────────────────────────────────────── */
/* 📋  Public wrapper                                          */
/* ──────────────────────────────────────────────────────────── */

export function DynamicForm<T extends ZodObject<any>>({
	schema,
	onSubmit,
}: {
	schema: T
	onSubmit: (data: z.infer<T>) => void
}) {
	const defaultValues = useMemo(() => getDefaultValues(schema), [schema])

	const methods = useForm<z.infer<T>>({
		resolver: zodResolver(schema),
		defaultValues: defaultValues as DefaultValues<output<T>>,
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

/* ──────────────────────────────────────────────────────────── */
/* 🔁  Recursive renderer                                      */
/* ──────────────────────────────────────────────────────────── */

function RenderSchema({
	schema,
	path = '',
}: {
	schema: ZodTypeAny
	path?: string
}): JSX.Element {
	/* NB: work with the *outer* node to detect optional/default,
     but unwrap to inspect the inner, real type.               */
	const optionalUI = isOptional(schema)
	const inner = unwrap(schema)
	const kind = inner.def.type

	/* ────────── Objects ────────── */
	if (kind === 'object') {
		const entries = (inner as ZodObject<any>).shape
		return (
			<>
				{Object.entries(entries).map(([key, sub]) => (
					<RenderSchema
						key={key}
						schema={sub as ZodType<unknown, unknown>}
						path={path ? `${path}.${key}` : key}
					/>
				))}
			</>
		)
	}

	/* ────────── Scalars ────────── */
	if (kind === 'string') return <InputText name={path} optional={optionalUI} />
	if (kind === 'number')
		return <InputNumber name={path} optional={optionalUI} />

	/* ────────── Literal unions ⇢ <select> ────────── */
	if (kind === 'union') {
		const literals = (inner as ZodUnion<any>).options as ZodLiteral<any>[]
		if (literals.every((l) => (l.def.type = 'literal'))) {
			return (
				<InputSelect
					name={path}
					options={literals.map((l) => String(l.def.values))}
					optional={optionalUI}
				/>
			)
		}
		return <Unsupported path={path} detail="Complex union" />
	}

	/* ────────── Fallback ────────── */
	return <Unsupported path={path} detail={kind} />
}

/* ──────────────────────────────────────────────────────────── */
/* 🖼️  Field primitives – swap out for your design system       */
/* ──────────────────────────────────────────────────────────── */

function Field({
	label,
	optional,
	children,
}: {
	label: string
	optional: boolean
	children: React.ReactNode
}) {
	return (
		<div className="flex flex-col gap-1">
			<label className="font-medium capitalize">
				{label}{' '}
				<span className="text-xs text-gray-500">
					{optional ? '(optional)' : '(required)'}
				</span>
			</label>
			{children}
		</div>
	)
}

function InputText({ name, optional }: { name: string; optional: boolean }) {
	const { register } = useFormContext()
	return (
		<Field label={name} optional={optional}>
			<input
				{...register(name)}
				type="text"
				className="w-full rounded border px-2 py-1"
			/>
		</Field>
	)
}

function InputNumber({ name, optional }: { name: string; optional: boolean }) {
	const { register } = useFormContext()
	return (
		<Field label={name} optional={optional}>
			<input
				{...register(name, { valueAsNumber: true })}
				type="number"
				className="w-full rounded border px-2 py-1"
			/>
		</Field>
	)
}

function InputSelect({
	name,
	options,
	optional,
}: {
	name: string
	options: string[]
	optional: boolean
}) {
	const { register } = useFormContext()
	return (
		<Field label={name} optional={optional}>
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
		<div className="rounded border border-red-400 p-2 text-sm text-red-700">
			<strong>Unsupported field</strong>
			<div>path: {path}</div>
			<div>detail: {detail}</div>
		</div>
	)
}

/* ──────────────────────────────────────────────────────────── */
/* 💡  Example usage                                           */
/* ──────────────────────────────────────────────────────────── */

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
