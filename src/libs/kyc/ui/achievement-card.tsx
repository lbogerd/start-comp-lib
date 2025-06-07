import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
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

const achievementCardVariants = tv({
	slots: {
		container: 'p-4 sm:p-6',
		header: 'mb-3 sm:mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
		content: 'flex items-center gap-3',
		icon: 'text-2xl sm:text-3xl',
		name: 'text-base sm:text-lg font-bold text-white',
	},
})

export type AchievementCardVariants = VariantProps<
	typeof achievementCardVariants
>

interface AchievementCardProps extends AchievementCardVariants {
	achievement: Achievement
	className?: string
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
	achievement,
	className,
}) => {
	const { container, header, content, icon, name } = achievementCardVariants()

	return (
		<Card variant="default" className={container({ class: className })}>
			<div className={header()}>
				<div className={content()}>
					<span className={icon()}>{achievement.icon}</span>
					<span className={name()}>{achievement.name}</span>
				</div>
				<Badge variant={achievement.rarity}>
					{achievement.rarity.toUpperCase()}
				</Badge>
			</div>
			<ProgressBar progress={achievement.progress} color={achievement.color} />
		</Card>
	)
}
