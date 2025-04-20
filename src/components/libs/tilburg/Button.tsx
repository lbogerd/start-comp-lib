import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'secondary'
}

export const Button: React.FC<ButtonProps> = ({
	children,
	className,
	variant = 'primary',
	...props
}) => {
	return (
		<button
			className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variant === 'primary' ? 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400' : 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400'} ${className ?? ''}`}
			{...props}
		>
			{children}
		</button>
	)
}

export default Button
