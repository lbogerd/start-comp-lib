import { Link } from '@tanstack/react-router'
import { removeExtension } from '~/logic/shared/files'
import { Registry } from '~/logic/shared/types'
import { HTMLAttributes, ComponentProps } from 'react'
import { cn } from '~/logic/client/cn'

type SidebarProps = {
	libs: {
		name: Registry['name']
		itemNames: Registry['items'][number]['name'][]
	}[]
} & ComponentProps<typeof BaseSidebar>

export function Sidebar({
	libs,
	className,
	...props
}: SidebarProps) {
	return (
		<BaseSidebar className={className} {...props}>
			<ul className="space-y-2">
				{libs?.length > 0 ? (
					libs.map((lib) => (
						<li key={lib.name} className="mb-3">
							<Link
								to={`/libs/$libName`}
								params={{ libName: lib.name }}
								className="font-semibold text-indigo-600 hover:text-indigo-800 text-lg"
							>
								{lib.name}
							</Link>

							<ul className="ml-4 mt-1 space-y-1">
								{lib.itemNames.map((itemName) => (
									<li key={itemName}>
										<Link
											to={`/libs/$libName/$compName`}
											params={{ libName: lib.name, compName: itemName }}
											className="text-gray-700 hover:text-indigo-600 text-sm"
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
		<BaseSidebar className={cn("animate-pulse space-y-2", className)} {...props}>
				<div className="h-4 w-24 bg-gray-200 rounded"></div>
				<div className="h-4 w-32 bg-gray-200 rounded ml-4"></div>
				<div className="h-4 w-32 bg-gray-200 rounded ml-4"></div>
		</BaseSidebar>
	)
}

function BaseSidebar({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("bg-white p-4 shrink-0 border-r border-gray-200", className)} {...props}>
      {children}
    </nav>
  )
}
