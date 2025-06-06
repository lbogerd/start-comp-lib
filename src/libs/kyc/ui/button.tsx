import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const buttonVariants = tv({
	base: 'rounded-2xl font-bold shadow-lg transition-all hover:scale-105',
	variants: {
		variant: {
			primary:
				'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-blue-400/30 hover:from-blue-500 hover:to-cyan-600 hover:shadow-blue-400/50',
			secondary:
				'border-2 border-slate-600 bg-slate-700 text-white hover:border-slate-500 hover:bg-slate-600',
			challenge:
				'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-orange-400/30 hover:from-orange-500 hover:to-red-600 hover:shadow-orange-400/50',
			friend:
				'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-blue-400/30 hover:from-blue-500 hover:to-cyan-600 hover:shadow-blue-400/50',
			mute: 'border-2 border-slate-600 bg-slate-700 text-white hover:border-slate-500 hover:bg-slate-600',
		},
		size: {
			sm: 'px-4 py-2 text-sm',
			md: 'px-6 py-3 text-base',
			lg: 'px-8 py-4 text-lg',
		},
	},
	defaultVariants: {
		variant: 'primary',
		size: 'md',
	},
})

export type ButtonVariants = VariantProps<typeof buttonVariants>

interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		ButtonVariants {
	children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
	variant,
	size,
	className,
	children,
	...props
}) => {
	return (
		<button
			className={buttonVariants({ variant, size, class: className })}
			{...props}
		>
			{children}
		</button>
	)
}
