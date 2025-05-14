import { glob } from 'tinyglobby'
import { removeExtension } from '~/logic/shared/files'
import { ItemType, ItemTypeEnum, Registry } from '~/logic/shared/types'

export const getLibs = async (): Promise<Registry[]> => {
	// get the name of all folders in the libs directory
	const libs = await glob({
		cwd: 'src/libs',
		onlyDirectories: true,
		deep: 1,
		expandDirectories: false,
	})

	// loop through each lib and add the items per item type
	const registry: Registry[] = []
	for (const lib of libs) {
		const libItemTypes = await glob({
			onlyDirectories: true,
			deep: 1,
			expandDirectories: false,
			cwd: `src/libs/${lib}`,
		})

		const itemTypes = libItemTypes.map((itemType) => {
			return itemType.slice(0, -1)
		})

		for (const itemType of itemTypes) {
			const registryItemType = `registry:${itemType}`

			// check if the registryItemType exists in the ItemTypeEnum
			if (!ItemTypeEnum.safeParse(registryItemType).success) {
				throw new Error(`Invalid item type: ${registryItemType}`)
			}

			const libItems = await glob('**/*.{js,ts,jsx,tsx}', {
				// we dont use registryItemType here as that would include
				// 'registry:' in the glob pattern
				cwd: `src/libs/${lib}/${itemType}`,
			})

			if (libItems.length === 0) {
				continue
			}

			const sortedLibItems = libItems.sort((a, b) => a.localeCompare(b))

			registry.push({
				name: lib.slice(0, -1),
				homepage: `http://localhost:3000/libs/${lib}`,
				items: sortedLibItems.map((item) => {
					return {
						name: removeExtension(item),
						// we can safely cast here because we checked the itemType
						type: registryItemType as ItemType,
					}
				}),
			})
		}
	}

	return registry.sort((a, b) => a.name.localeCompare(b.name))
}
