import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const cardVariants = tv({
	base: 'rounded-2xl transition-all duration-300',
	variants: {
		variant: {
			default:
				'border border-slate-600 bg-slate-800/50 backdrop-blur hover:scale-105',
			glass:
				'border border-slate-600 bg-slate-800/50 backdrop-blur hover:bg-slate-700/50',
			gradient:
				'relative overflow-hidden border-2 border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

export type CardVariants = VariantProps<typeof cardVariants>

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, CardVariants {
	children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
	variant,
	className,
	children,
	...props
}) => {
	return (
		<div className={cardVariants({ variant, class: className })} {...props}>
			{children}
		</div>
	)
}

const statCardVariants = tv({
	base: 'p-4 text-center',
	slots: {
		base: 'p-4 text-center',
		icon: 'mb-2 text-4xl',
		value:
			'mb-2 bg-gradient-to-r bg-clip-text text-3xl font-black text-transparent',
		label: 'text-sm font-medium text-slate-300',
		trend: 'text-xs font-bold text-green-400',
	},
})

export type StatCardVariants = VariantProps<typeof statCardVariants>

interface StatCardProps extends StatCardVariants {
	value: string | number
	label: string
	trend?: string
	color: string
	icon?: string
	className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
	value,
	label,
	trend,
	color,
	icon,
	className,
}) => {
	const {
		base,
		icon: iconSlot,
		value: valueSlot,
		label: labelSlot,
		trend: trendSlot,
	} = statCardVariants()

	return (
		<Card variant="default" className={base({ class: className })}>
			{icon && <div className={iconSlot()}>{icon}</div>}
			<div className={valueSlot({ class: color })}>{value}</div>
			<div className={labelSlot()}>{label}</div>
			{trend && <div className={trendSlot()}>{trend}</div>}
		</Card>
	)
}
