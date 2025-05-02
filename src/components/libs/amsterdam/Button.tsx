import React from 'react'
import { cn } from '~/logic/client/cn'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button: React.FC<ButtonProps> = ({
	children,
	className,
	disabled,
	...props
}) => {
	return (
		<button
			className={cn(
				'rounded bg-blue-600 px-4 py-2 font-semibold text-white transition duration-150 ease-in-out hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/50 focus:outline-none disabled:cursor-not-allowed disabled:bg-blue-400 disabled:opacity-50',
				className,
			)}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	)
}
export default Button
