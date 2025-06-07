import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export interface Activity {
	text: string
	color: string
}

const activityItemVariants = tv({
	base: 'rounded-r-xl border-l-4 bg-slate-800/50 p-3 sm:p-4 text-sm sm:text-base font-medium text-slate-200 backdrop-blur transition-all hover:bg-slate-700/50 active:bg-slate-700/60 touch-manipulation',
})

export type ActivityItemVariants = VariantProps<typeof activityItemVariants>

interface ActivityItemProps extends ActivityItemVariants {
	activity: Activity
	className?: string
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
	activity,
	className,
}) => {
	return (
		<div
			className={activityItemVariants({
				class: [activity.color, className],
			})}
		>
			{activity.text}
		</div>
	)
}
