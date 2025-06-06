import React from 'react'
import { cn } from '~/logic/shared/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: 'default' | 'glass' | 'gradient'
	children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
	variant = 'default',
	className,
	children,
	...props
}) => {
	const baseClasses = 'rounded-2xl transition-all duration-300'

	const variantClasses = {
		default:
			'bg-slate-800/50 backdrop-blur border border-slate-600 hover:scale-105',
		glass:
			'bg-slate-800/50 backdrop-blur border border-slate-600 hover:bg-slate-700/50',
		gradient:
			'bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 shadow-2xl relative overflow-hidden',
	}

	return (
		<div
			className={cn(baseClasses, variantClasses[variant], className)}
			{...props}
		>
			{children}
		</div>
	)
}

interface StatCardProps {
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
	return (
		<Card variant="default" className={cn('p-4 text-center', className)}>
			{icon && <div className="mb-2 text-4xl">{icon}</div>}
			<div
				className={cn(
					'mb-2 bg-gradient-to-r bg-clip-text text-3xl font-black text-transparent',
					color,
				)}
			>
				{value}
			</div>
			<div className="text-sm font-medium text-slate-300">{label}</div>
			{trend && <div className="text-xs font-bold text-green-400">{trend}</div>}
		</Card>
	)
}
