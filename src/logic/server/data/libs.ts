import { glob } from 'tinyglobby'
import { Registry } from '~/logic/shared/types'

export const getLibs = async (): Promise<Registry[]> => {
	// get the name of all folders in the libs directory
	const libs = await glob({
		cwd: 'src/components/libs',
		onlyDirectories: true,
		deep: 1,
		expandDirectories: false,
	})

	// loop through each lib and add the items
	const registry: Registry[] = []
	for (const lib of libs) {
		const libItems = await glob('**/*.{js,ts,jsx,tsx}', {
			cwd: `src/components/libs/${lib}`,
		})

		const sortedLibItems = libItems.sort((a, b) => a.localeCompare(b))

		registry.push({
			name: lib.slice(0, -1),
			homepage: `http://localhost:3000/libs/${lib}`,
			items: sortedLibItems.map((item) => {
				return {
					name: item,
					// TODO: make this dynamic based on either the file name or the file's frontmatter
					type: 'registry:lib',
				}
			}),
		})
	}

	return registry.sort((a, b) => a.name.localeCompare(b.name))
}
