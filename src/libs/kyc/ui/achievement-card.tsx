import React from 'react'
import { cn } from '~/logic/shared/cn'
import { Badge } from './badge'
import { Card } from './card'
import { ProgressBar } from './progress-bar'

export interface Achievement {
	name: string
	progress: number
	rarity: 'legendary' | 'epic' | 'rare' | 'common'
	icon: string
	color: string
}

interface AchievementCardProps {
	achievement: Achievement
	className?: string
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
	achievement,
	className,
}) => {
	return (
		<Card variant="default" className={cn('p-6', className)}>
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<span className="text-3xl">{achievement.icon}</span>
					<span className="text-lg font-bold text-white">
						{achievement.name}
					</span>
				</div>
				<Badge variant={achievement.rarity}>
					{achievement.rarity.toUpperCase()}
				</Badge>
			</div>
			<ProgressBar progress={achievement.progress} color={achievement.color} />
		</Card>
	)
}
