import { Link } from '@tanstack/react-router'
import { removeExtension } from '~/logic/shared/files'
import { Registry } from '~/logic/shared/types'

export function Nav({ libs }: { libs: Registry[] }) {
	return (
		<nav className="bg-white p-4 shrink-0 border-r border-gray-200">
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
								{lib.items.map((item) => (
									<li key={item.name}>
										<Link
											to={`/libs/$libName/$compName`}
											params={{ libName: lib.name, compName: item.name }}
											className="text-gray-700 hover:text-indigo-600 text-sm"
										>
											{removeExtension(item.name)}
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
		</nav>
	)
}
