import React from 'react'
import { cn } from '~/logic/shared/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'challenge' | 'friend' | 'mute'
	size?: 'sm' | 'md' | 'lg'
	children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
	variant = 'primary',
	size = 'md',
	className,
	children,
	...props
}) => {
	const baseClasses =
		'font-bold rounded-2xl transition-all shadow-lg hover:scale-105'

	const sizeClasses = {
		sm: 'px-4 py-2 text-sm',
		md: 'px-6 py-3 text-base',
		lg: 'px-8 py-4 text-lg',
	}

	const variantClasses = {
		primary:
			'bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white shadow-blue-400/30 hover:shadow-blue-400/50',
		secondary:
			'bg-slate-700 hover:bg-slate-600 text-white border-2 border-slate-600 hover:border-slate-500',
		challenge:
			'bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white shadow-orange-400/30 hover:shadow-orange-400/50',
		friend:
			'bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white shadow-blue-400/30 hover:shadow-blue-400/50',
		mute: 'bg-slate-700 hover:bg-slate-600 text-white border-2 border-slate-600 hover:border-slate-500',
	}

	return (
		<button
			className={cn(
				baseClasses,
				sizeClasses[size],
				variantClasses[variant],
				className,
			)}
			{...props}
		>
			{children}
		</button>
	)
}
