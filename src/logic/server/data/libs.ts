import { readFile } from 'fs/promises'
import { glob } from 'tinyglobby'
import { removeExtension } from '~/logic/shared/files'
import {
	ItemType,
	ItemTypeEnum,
	Registry,
	RegistryItem,
} from '~/logic/shared/types'
import { getItemDependencies } from './getItemDependencies'

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
			const itemTypeParse = await ItemTypeEnum.safeParseAsync(
				`registry:${itemType}`,
			)

			// check if the itemType exists in the ItemTypeEnum
			if (!itemTypeParse.success) {
				throw new Error(`Invalid item type: ${itemTypeParse.error}`)
			}
			const registryItemType = itemTypeParse.data

			const libItems = await glob('**/*.{js,ts,jsx,tsx}', {
				// we dont use registryItemType here as that would include
				// 'registry:' in the glob pattern
				cwd: `src/libs/${lib}/${itemType}`,
			})

			if (libItems.length === 0) {
				continue
			}

			const sortedLibItems = libItems.sort((a, b) => a.localeCompare(b))

			const dependencies = new Set<string>()
			const devDependencies = new Set<string>()
			const registryDependencies = new Set<string>()

			// loop through each item and get the dependencies
			for (const item of sortedLibItems) {
				const {
					externalPackages,
					devDependencies: itemDevDependencies,
					internalImports,
				} = await getItemDependencies(
					`src/libs/${lib}/${itemType}/${item}`,
					true,
				)

				for (const pkg of externalPackages) {
					dependencies.add(pkg)
				}
				for (const dev of itemDevDependencies) {
					devDependencies.add(dev)
				}
				for (const imp of internalImports) {
					registryDependencies.add(imp)
				}
			}

			registry.push({
				name: lib.slice(0, -1),
				homepage: `http://localhost:3000/libs/${lib}`,
				items: await Promise.all(
					sortedLibItems.map(async (item) => {
						const registryItem: RegistryItem = {
							name: removeExtension(item),
							// we can safely cast here because we checked the itemType
							type: registryItemType as ItemType,

							// TODO: remove or implement
							description: '',
							title: '',
							author: '',

							dependencies: [...dependencies],
							devDependencies: [...devDependencies],
							registryDependencies: [...registryDependencies],

							files: [
								{
									path: `libs/${lib}/${itemType}/${item}`,
									type: registryItemType as ItemType,
									content: await readFile(
										`src/libs/${lib}/${itemType}/${item}`,
										'utf-8',
									),
								},
							],
						}

						return registryItem
					}),
				),
			})
		}
	}

	// sort by item type and then by name
	return registry.sort((a, b) => {
		if (a.items[0].type === b.items[0].type) {
			return a.name.localeCompare(b.name)
		}
		return a.items[0].type.localeCompare(b.items[0].type)
	})
}
