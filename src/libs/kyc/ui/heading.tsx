import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const headingVariants = tv({
	base: 'flex items-center gap-2 sm:gap-3 font-black text-white',
	variants: {
		level: {
			1: 'text-3xl sm:text-4xl lg:text-5xl',
			2: 'text-xl sm:text-2xl',
			3: 'text-lg sm:text-xl',
			4: 'text-base sm:text-lg',
			5: 'text-sm sm:text-base',
			6: 'text-xs sm:text-sm',
		},
		variant: {
			default: '',
			gradient:
				'bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent',
			section: 'mb-4 sm:mb-6',
		},
	},
	defaultVariants: {
		level: 2,
		variant: 'default',
	},
})

export type HeadingVariants = VariantProps<typeof headingVariants>

interface HeadingProps extends HeadingVariants {
	icon?: string
	children: React.ReactNode
	className?: string
}

export const Heading: React.FC<HeadingProps> = ({
	level = 2,
	variant,
	icon,
	children,
	className,
}) => {
	const baseProps = {
		className: headingVariants({ level, variant, class: className }),
	}

	const content = (
		<>
			{icon && <span>{icon}</span>}
			{variant === 'gradient' ? (
				<span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
					{children}
				</span>
			) : (
				children
			)}
		</>
	)

	switch (level) {
		case 1:
			return <h1 {...baseProps}>{content}</h1>
		case 2:
			return <h2 {...baseProps}>{content}</h2>
		case 3:
			return <h3 {...baseProps}>{content}</h3>
		case 4:
			return <h4 {...baseProps}>{content}</h4>
		case 5:
			return <h5 {...baseProps}>{content}</h5>
		case 6:
			return <h6 {...baseProps}>{content}</h6>
		default:
			return <h2 {...baseProps}>{content}</h2>
	}
}
