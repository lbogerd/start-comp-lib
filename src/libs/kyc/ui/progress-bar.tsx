import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const progressBarVariants = tv({
	slots: {
		container: 'w-full',
		track: 'mb-2 h-2 w-full rounded-full bg-slate-700 sm:h-3',
		fill: 'h-2 rounded-full bg-gradient-to-r shadow-lg transition-all duration-300 sm:h-3',
		percentage: 'text-xs font-medium text-slate-400 sm:text-sm',
	},
})

export type ProgressBarVariants = VariantProps<typeof progressBarVariants>

interface ProgressBarProps extends ProgressBarVariants {
	progress: number
	color: string
	className?: string
	showPercentage?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
	progress,
	color,
	className,
	showPercentage = true,
}) => {
	const { container, track, fill, percentage } = progressBarVariants()

	return (
		<div className={container({ class: className })}>
			<div className={track()}>
				<div
					className={fill({ class: color })}
					style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
				/>
			</div>
			{showPercentage && (
				<div className={percentage()}>{progress}% Complete</div>
			)}
		</div>
	)
}
