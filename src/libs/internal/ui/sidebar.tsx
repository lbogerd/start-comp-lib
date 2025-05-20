import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import {
	ComponentProps,
	HTMLAttributes,
	useEffect,
	useRef,
	useState,
} from 'react'
import { useDebounce } from '~/logic/client/use-debounce'
import { useHotkey } from '~/logic/client/use-hotkey'
import { cn } from '~/logic/shared/cn'
import { Registry } from '~/logic/shared/types'
import { Input } from './input'

type SidebarProps = {
	libs: {
		name: Registry['name']
		items: { name: Registry['items'][number]['name']; compType: string }[]
	}[]
} & ComponentProps<typeof BaseSidebar>

export function Sidebar({ libs, className, ...props }: SidebarProps) {
	const [filterText, setFilterText] = useState('')
	const debouncedFilterText = useDebounce<string>(filterText, 200)
	const [displayedLibs, setDisplayedLibs] = useState(libs)
	const filterInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (debouncedFilterText === '') {
			setDisplayedLibs(libs)
		} else {
			const lowerCaseFilter = debouncedFilterText.toLowerCase()
			const filtered = libs
				.map((lib) => ({
					...lib,
					items: lib.items.filter((item) =>
						item.name.toLowerCase().includes(lowerCaseFilter),
					),
				}))
				.filter(
					(lib) =>
						lib.items.length > 0 ||
						lib.name.toLowerCase().includes(lowerCaseFilter),
				)
			setDisplayedLibs(filtered)
		}
	}, [debouncedFilterText, libs])

	useHotkey(
		[
			{ key: 'k', options: { meta: true } },
			{ key: 'k', options: { ctrl: true } },
		],
		() => filterInputRef.current?.focus(),
	)

	return (
		<BaseSidebar className={className} {...props}>
			<div className="relative px-4 pb-4">
				<Input
					ref={filterInputRef}
					id="filter-input"
					placeholder="Filter components..."
					value={filterText}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setFilterText(e.target.value)
					}
					className="w-full"
				/>
			</div>

			<ul className="space-y-4">
				{displayedLibs?.length > 0 ? (
					displayedLibs.map((lib) => (
						<li key={lib.name}>
							<h3 className="ml-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
								{lib.name}
							</h3>

							<ul className="mt-1 space-y-1">
								{lib.items.map((item) => (
									<li
										key={item.name}
										className="group flex items-center space-x-2"
									>
										<ChevronRight className="mt-0.5 ml-3 size-4 shrink-0 opacity-0 group-hover:text-indigo-600 group-hover:opacity-100 dark:group-hover:text-indigo-400" />
										<Link
											to={`/libs/$libName/$compType/$compName`}
											params={{
												libName: lib.name,
												compType: item.compType,
												compName: item.name,
											}}
											className="block grow text-sm text-neutral-700 transition group-hover:text-indigo-600 dark:text-neutral-300 dark:group-hover:text-indigo-400"
											activeOptions={{
												exact: true,
											}}
											activeProps={{
												className: '!text-indigo-600 dark:!text-indigo-400',
											}}
										>
											{item.name}
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
				'shrink-0 border-r border-neutral-200 bg-neutral-50 py-4 shadow dark:border-neutral-700 dark:bg-neutral-900',
				className,
			)}
			{...props}
		>
			{children}
		</nav>
	)
}
