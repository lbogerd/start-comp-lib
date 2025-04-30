import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { ComponentProps, HTMLAttributes, useEffect, useState } from 'react'
import { cn } from '~/logic/client/cn'
import { Registry } from '~/logic/shared/types'
import { useDebounce } from '~/logic/shared/use-debounce'
import { Input } from './input'

type SidebarProps = {
	libs: {
		name: Registry['name']
		itemNames: Registry['items'][number]['name'][]
	}[]
} & ComponentProps<typeof BaseSidebar>

export function Sidebar({ libs, className, ...props }: SidebarProps) {
	const [filterText, setFilterText] = useState('')
	const debouncedFilterText = useDebounce<string>(filterText, 200)
	const [displayedLibs, setDisplayedLibs] = useState(libs)

	useEffect(() => {
		if (debouncedFilterText === '') {
			setDisplayedLibs(libs)
		} else {
			const lowerCaseFilter = debouncedFilterText.toLowerCase()
			const filtered = libs
				.map((lib) => ({
					...lib,
					itemNames: lib.itemNames.filter((itemName) =>
						itemName.toLowerCase().includes(lowerCaseFilter),
					),
				}))
				.filter(
					(lib) =>
						lib.itemNames.length > 0 ||
						lib.name.toLowerCase().includes(lowerCaseFilter),
				)
			setDisplayedLibs(filtered)
		}
	}, [debouncedFilterText, libs])

	return (
		<BaseSidebar className={className} {...props}>
			<div className="relative px-4 pb-4">
				<Input
					placeholder="Filter components..."
					value={filterText}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)}
					className="w-full"
				/>
			</div>
			
			<ul className="space-y-4">
				{displayedLibs?.length > 0 ? (
					displayedLibs.map((lib) => (
						<li key={lib.name}>
							<Link
								to={`/libs/$libName`}
								params={{ libName: lib.name }}
								className="block px-4 text-lg font-semibold text-indigo-600 transition-all hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-500"
								activeOptions={{
									exact: false,
								}}
								activeProps={{
									className: '!text-indigo-600 dark:!text-indigo-400',
								}}
							>
								{lib.name}
							</Link>

							<ul className="mt-1 space-y-1">
								{lib.itemNames.map((itemName) => (
									<li
										key={itemName}
										className="group flex items-center space-x-2"
									>
										<ChevronRight className="mt-0.5 ml-3 size-4 shrink-0 opacity-0 group-hover:text-indigo-600 group-hover:opacity-100 dark:group-hover:text-indigo-400" />
										<Link
											to={`/libs/$libName/$compName`}
											params={{ libName: lib.name, compName: itemName }}
											className="block grow text-sm text-neutral-700 transition group-hover:text-indigo-600 dark:text-neutral-300 dark:group-hover:text-indigo-400"
											activeOptions={{
												exact: true,
											}}
											activeProps={{
												className: '!text-indigo-600 dark:!text-indigo-400',
											}}
										>
											{itemName}
										</Link>
									</li>
								))}
							</ul>
						</li>
					))
				) : (
					<li className="px-4 text-sm text-neutral-500 italic">None found</li>
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
			<div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
			<div className="ml-6 h-4 w-32 animate-pulse rounded bg-gray-200"></div>
			<div className="ml-6 h-4 w-32 animate-pulse rounded bg-gray-200"></div>
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
				'shrink-0 border-r border-neutral-200 bg-neutral-50 py-4 dark:bg-neutral-900',
				className,
			)}
			{...props}
		>
			{children}
		</nav>
	)
}
