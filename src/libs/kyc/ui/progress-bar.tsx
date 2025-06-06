import React from 'react'
import { cn } from '~/logic/shared/cn'

interface ProgressBarProps {
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
	return (
		<div className={cn('w-full', className)}>
			<div className="mb-2 h-3 w-full rounded-full bg-slate-700">
				<div
					className={cn('h-3 rounded-full bg-gradient-to-r shadow-lg', color)}
					style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
				/>
			</div>
			{showPercentage && (
				<div className="text-sm font-medium text-slate-400">
					{progress}% Complete
				</div>
			)}
		</div>
	)
}
