import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const badgeVariants = tv({
	base: 'flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-lg',
	variants: {
		variant: {
			verified:
				'bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-blue-400/30',
			online:
				'bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-green-400/30',
			away: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-yellow-400/30',
			offline:
				'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-gray-400/30',
			legendary:
				'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-white shadow-yellow-400/30',
			epic: 'bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-white shadow-purple-400/30',
			rare: 'bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 text-white shadow-blue-400/30',
			common:
				'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-gray-400/30',
		},
	},
	defaultVariants: {
		variant: 'verified',
	},
})

export type BadgeVariants = VariantProps<typeof badgeVariants>

interface BadgeProps extends BadgeVariants {
	children: React.ReactNode
	className?: string
}

export const Badge: React.FC<BadgeProps> = ({
	variant,
	children,
	className,
}) => {
	return (
		<span className={badgeVariants({ variant, class: className })}>
			{children}
		</span>
	)
}

const statusDotVariants = tv({
	base: 'h-8 w-8 rounded-full border-4 border-slate-800 shadow-lg',
	variants: {
		status: {
			online: 'bg-green-400 shadow-green-400/50',
			away: 'bg-yellow-400 shadow-yellow-400/50',
			offline: 'bg-gray-400 shadow-gray-400/50',
		},
	},
	defaultVariants: {
		status: 'online',
	},
})

export type StatusDotVariants = VariantProps<typeof statusDotVariants>

interface StatusDotProps extends StatusDotVariants {
	className?: string
}

export const StatusDot: React.FC<StatusDotProps> = ({ status, className }) => {
	return <div className={statusDotVariants({ status, class: className })} />
}
