import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button: React.FC<ButtonProps> = ({
	children,
	className,
	disabled,
	...props
}) => {
	return (
		<button
			className={`focus:ring-opacity-50 rounded bg-blue-600 px-4 py-2 font-semibold text-white transition duration-150 ease-in-out hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-blue-400 disabled:opacity-50 ${className} `}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	)
}
export default Button
