import React from 'react'
import { cn } from '~/logic/shared/cn'

export interface Activity {
	text: string
	color: string
}

interface ActivityItemProps {
	activity: Activity
	className?: string
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
	activity,
	className,
}) => {
	return (
		<div
			className={cn(
				'rounded-r-xl border-l-4 bg-slate-800/50 p-4 font-medium text-slate-200 backdrop-blur transition-all hover:bg-slate-700/50',
				activity.color,
				className,
			)}
		>
			{activity.text}
		</div>
	)
}
