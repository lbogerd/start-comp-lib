import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const badgeVariants = tv({
	base: 'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold shadow-lg transition-all sm:px-3 sm:py-1 sm:text-sm',
	variants: {
		variant: {
			verified:
				'bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-blue-400/30',
			online:
				'bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-green-400/10',
			away: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-yellow-400/10',
			offline:
				'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-gray-400/10',
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
	base: 'h-6 w-6 rounded-full border-2 border-slate-800 shadow-lg transition-all sm:h-8 sm:w-8 sm:border-4',
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
	const capitalizedStatus = status
		? status?.charAt(0).toUpperCase() + status?.slice(1)
		: undefined

	return (
		<div
			className={statusDotVariants({ status, class: className })}
			title={capitalizedStatus}
		/>
	)
}
