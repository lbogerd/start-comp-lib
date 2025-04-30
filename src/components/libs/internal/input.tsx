import { ComponentProps } from 'react'
import { cn } from '~/logic/client/cn'

export function Input({
	className,
	type,
	ref,
	...props
}: ComponentProps<'input'>) {
	return (
		<input
			type={type}
			className={cn(
				'flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 placeholder:text-neutral-500 file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-400 dark:focus:ring-indigo-400 transition-all',
				className,
			)}
			ref={ref}
			{...props}
		/>
	)
}
