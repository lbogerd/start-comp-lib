import { readFile } from 'fs/promises'
import { glob } from 'tinyglobby'
import { removeExtension } from '~/logic/shared/files'
import {
	ItemType,
	ItemTypeEnum,
	Registry,
	RegistryItem,
} from '~/logic/shared/types'
import { getItemDependencies } from './dependencies'
import { getReactProps } from './props'

export const getLibs = async (): Promise<Registry[]> => {
	// Get the name of all folders in the libs directory
	const libs = await glob({
		cwd: 'src/libs',
		onlyDirectories: true,
		deep: 1,
		expandDirectories: false,
	})

	// Loop through each lib and aggregate **all** items (across all component types)
	const registry: Registry[] = []

	for (const lib of libs) {
		// Collect the different component-/item-type folders that exist inside the lib
		const libItemTypeDirs = await glob({
			onlyDirectories: true,
			deep: 1,
			expandDirectories: false,
			cwd: `src/libs/${lib}`,
		})

		const itemTypes = libItemTypeDirs.map((dir) => dir.slice(0, -1)) // remove trailing '/'

		// Prepare a list that will hold every item that belongs to this lib
		const libItems: RegistryItem[] = []

		for (const itemType of itemTypes) {
			// Parse the directory name to a valid ItemTypeEnum value (e.g. "ui" -> "registry:ui")
			const itemTypeParse = await ItemTypeEnum.safeParseAsync(
				`registry:${itemType}`,
			)

			if (!itemTypeParse.success) {
				throw new Error(`Invalid item type: ${itemTypeParse.error}`)
			}

			const registryItemType = itemTypeParse.data

			// Retrieve all relevant code files for this item type
			const itemFiles = await glob('**/*.{js,ts,jsx,tsx}', {
				cwd: `src/libs/${lib}/${itemType}`,
			})

			if (itemFiles.length === 0) continue

			const sortedItemFiles = itemFiles.sort((a, b) => a.localeCompare(b))

			for (const item of sortedItemFiles) {
				// Determine dependencies for this specific item
				const {
					externalPackages,
					devDependencies: itemDevDependencies,
					internalImports,
				} = await getItemDependencies(
					`src/libs/${lib}/${itemType}/${item}`,
					true,
				)

				const registryItem: RegistryItem = {
					name: removeExtension(item),
					type: registryItemType as ItemType,

					// Props documentation (temporary)
					docs: JSON.stringify(
						getReactProps(
							`src/libs/${lib}/${itemType}/${item}`,
							removeExtension(item.charAt(0).toUpperCase() + item.slice(1)),
						),
						null,
						2,
					),

					// TODO: remove or implement these metadata fields later
					description: '',
					title: '',
					author: '',

					dependencies: [...externalPackages],
					devDependencies: [...itemDevDependencies],
					registryDependencies: [...internalImports],

					files: [
						{
							path: `libs/${lib.slice(0, -1)}/${itemType}/${item}`,
							type: registryItemType as ItemType,
							content: await readFile(
								`src/libs/${lib}/${itemType}/${item}`,
								'utf-8',
							),
						},
					],
				}

				libItems.push(registryItem)
			}
		}

		// Skip libs that didn't yield any items (edge-case)
		if (libItems.length === 0) continue

		// Sort items first by type and then by name for deterministic ordering
		libItems.sort((a, b) => {
			if (a.type === b.type) {
				return a.name.localeCompare(b.name)
			}
			return a.type.localeCompare(b.type)
		})

		registry.push({
			name: lib.slice(0, -1),
			homepage: `http://localhost:3000/libs/${lib.slice(0, -1)}`,
			items: libItems,
		})
	}

	// Sort the final registry list by lib name
	return registry.sort((a, b) => a.name.localeCompare(b.name))
}
