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
			className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${variant === 'primary' ? 'bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-400' : 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400'} ${className ?? ''}`}
			{...props}
		>
			{children}
		</button>
	)
}

export default Button
