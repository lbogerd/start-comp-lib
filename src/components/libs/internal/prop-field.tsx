import { PropItem } from 'react-docgen-typescript'
import { Control, Controller } from 'react-hook-form'

/**
 * A form field component that renders different input types based on component prop metadata.
 *
 * Handles the following prop types:
 * - Simple scalars (string, number, boolean)
 * - Literal unions (e.g. "sm" | "md" | "lg")
 * - Complex types (objects, arrays etc)
 *
 * @example
 * ```tsx
 * <PropField
 *   meta={{
 *     name: "size",
 *     type: { name: '"sm" | "md" | "lg"' },
 *     required: true
 *   }}
 *   control={control}
 * />
 * ```
 *
 * @param props.meta - Metadata about the prop including:
 *   - name: The name of the prop
 *   - type: The prop's type information
 *   - required: Whether the prop is required
 *   - defaultValue: Optional default value
 * @param props.control - React Hook Form control object
 */
export function PropField({
	meta,
	control,
}: {
	meta: PropItem
	control: Control<any>
}) {
	const { name, type, defaultValue, required } = meta
	const def = defaultValue?.value

	// 1. simple scalars
	if (type.name === 'string' || type.name === 'number')
		return (
			<label className="flex flex-col gap-1">
				{name}
				<Controller
					name={name}
					control={control}
					defaultValue={def ?? ''}
					rules={{ required }}
					render={({ field }) => (
						<input
							{...field}
							type={type.name === 'number' ? 'number' : 'text'}
							className="input"
						/>
					)}
				/>
			</label>
		)

	if (type.name === 'boolean')
		return (
			<label className="inline-flex items-center gap-2">
				<Controller
					name={name}
					control={control}
					defaultValue={def ?? false}
					render={({ field }) => <input type="checkbox" {...field} />}
				/>
				{name}
			</label>
		)

	// 2. literal unions like `"sm" | "md" | "lg"`
	if (type.name === 'enum') {
		const options = type
			.raw!.split('|')
			.map((s) => s.trim().replace(/"/g, ''))
			.filter((o) => o !== 'undefined')
		return (
			<label className="flex flex-col gap-1">
				{name}
				<Controller
					name={name}
					control={control}
					defaultValue={def ?? options[0]}
					rules={{ required }}
					render={({ field }) => (
						<select {...field} className="select">
							{options.map((o) => (
								<option key={o}>
									{o} {o === def && '(default)'}
								</option>
							))}
						</select>
					)}
				/>
			</label>
		)
	}

	// 3. everything else: JSON textarea
	return (
		<label className="flex flex-col gap-1">
			{name} (JSON)
			<Controller
				name={name}
				control={control}
				defaultValue={def ?? ''}
				render={({ field }) => (
					<textarea
						{...field}
						rows={3}
						spellCheck={false}
						className="textarea"
					/>
				)}
			/>
		</label>
	)
}
