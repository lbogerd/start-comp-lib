import { useForm } from '@mantine/form'
import { Button } from '~/libs/kyc/ui/button'

export function ParticlesForm({
	onSubmit = (values) => console.log(values),
}: {
	onSubmit?: (values: {
		particleCount: number
		fpsLimit: number
		interactive: boolean
	}) => void
}) {
	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			particleCount: 250,
			fpsLimit: 120,
			interactive: true,
		},
	})

	return (
		<form
			onSubmit={form.onSubmit((values) => onSubmit(values))}
			className="z-50 max-w-md rounded-lg bg-white p-6 shadow"
		>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-1">
					<label
						htmlFor="particleCount"
						className="mb-1 font-medium text-gray-700"
					>
						Particle Count
					</label>
					<input
						type="number"
						id="particleCount"
						{...form.getInputProps('particleCount')}
						min={0}
						step={10}
						className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor="fpsLimit" className="mb-1 font-medium text-gray-700">
						FPS Limit
					</label>
					<input
						type="number"
						id="fpsLimit"
						{...form.getInputProps('fpsLimit')}
						min={1}
						max={240}
						step={1}
						className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						id="interactive"
						{...form.getInputProps('interactive', { type: 'checkbox' })}
						className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					<label htmlFor="interactive" className="text-gray-700">
						Enable Interaction
					</label>
				</div>

				<Button type="submit" className="mt-2 w-full">
					Submit
				</Button>
			</div>
		</form>
	)
}
