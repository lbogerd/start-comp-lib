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
			className={`
        px-4 py-2 rounded font-semibold text-white
        bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        transition duration-150 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-400
        ${className}
      `}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	)
}
export default Button
