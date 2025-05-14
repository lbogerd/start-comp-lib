import { ComponentProps } from 'react'
import { cn } from '~/logic/shared/cn'

interface InputProps extends ComponentProps<'input'> {
	className?: string
	type?: string
}

const Input = ({ className, type, ...props }: InputProps) => {
	return (
		<input
			type={type}
			className={cn(
				'flex h-10 w-full rounded-md border border-emerald-600 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-neutral-900 dark:ring-offset-neutral-900 dark:file:text-neutral-50',
				className,
			)}
			{...props}
		/>
	)
}
Input.displayName = 'Input'

export { Input }
