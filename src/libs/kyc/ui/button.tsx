import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const buttonVariants = tv({
	base: 'touch-manipulation rounded-2xl font-bold whitespace-nowrap shadow-lg transition-all hover:scale-105 active:scale-95',
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
			sm: 'min-h-[2.5rem] px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm',
			md: 'min-h-[3rem] px-4 py-3 text-sm sm:px-6 sm:py-3 sm:text-base',
			lg: 'min-h-[3.5rem] px-6 py-4 text-base sm:px-8 sm:py-4 sm:text-lg',
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
