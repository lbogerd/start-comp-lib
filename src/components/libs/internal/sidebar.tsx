import { Link } from '@tanstack/react-router'
import { ComponentProps, HTMLAttributes } from 'react'
import { cn } from '~/logic/client/cn'
import { removeExtension } from '~/logic/shared/files'
import { Registry } from '~/logic/shared/types'

type SidebarProps = {
	libs: {
		name: Registry['name']
		itemNames: Registry['items'][number]['name'][]
	}[]
} & ComponentProps<typeof BaseSidebar>

export function Sidebar({ libs, className, ...props }: SidebarProps) {
	return (
		<BaseSidebar className={className} {...props}>
			<ul className="space-y-4">
				{libs?.length > 0 ? (
					libs.map((lib) => (
						<li key={lib.name}>
							<Link
								to={`/libs/$libName`}
								params={{ libName: lib.name }}
								className="font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-500 text-lg px-4 transition-all block"
							>
								{lib.name}
							</Link>

							<ul className="mt-1 space-y-1">
								{lib.itemNames.map((itemName) => (
									<li key={itemName}>
										<Link
											to={`/libs/$libName/$compName`}
											params={{ libName: lib.name, compName: itemName }}
											className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition block px-6 before:content-['>'] before:text-indigo-600 dark:before:text-indigo-400 before:opacity-0 hover:before:opacity-100 before:duration-75 before:mr-1"
										>
											{removeExtension(itemName)}
										</Link>
									</li>
								))}
							</ul>
						</li>
					))
				) : (
					<li className="text-gray-500 italic">None found</li>
				)}
			</ul>
		</BaseSidebar>
	)
}

export function SidebarSkeleton({
	className,
	...props
}: Omit<ComponentProps<typeof BaseSidebar>, 'libs'>) {
	return (
		<BaseSidebar className={cn('space-y-2 px-4', className)} {...props}>
			<div className="animate-pulse h-4 w-24 bg-gray-200 rounded"></div>
			<div className="animate-pulse h-4 w-32 bg-gray-200 rounded ml-4"></div>
			<div className="animate-pulse h-4 w-32 bg-gray-200 rounded ml-4"></div>
		</BaseSidebar>
	)
}

function BaseSidebar({
	children,
	className,
	...props
}: HTMLAttributes<HTMLElement>) {
	return (
		<nav
			className={cn(
				'bg-neutral-50 dark:bg-neutral-900 shrink-0 border-r border-gray-200 py-4',
				className,
			)}
			{...props}
		>
			{children}
		</nav>
	)
}
