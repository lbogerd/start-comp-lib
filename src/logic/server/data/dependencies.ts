import { existsSync } from 'fs'
import fs from 'fs/promises'
import { createRequire } from 'module'
import path from 'path'
import { Project } from 'ts-morph'

const require = createRequire(import.meta.url)

/**
 * Gets the dependencies for a specific file
 * @param filePath Path to the file to analyze
 * @param includeVersion Whether to include version information for packages (defaults to false)
 * @returns Object containing the file's dependencies categorized
 */
export async function getItemDependencies(
	filePath: string,
	includeVersion = false,
) {
	// Create a ts-morph project and add the target file
	const project = new Project()
	const sourceFile = project.addSourceFileAtPath(filePath)

	// Initialize dependency sets
	const externalPackages = new Set<string>()
	const internalImports = new Set<string>()

	// Process imports in the file
	sourceFile.getImportDeclarations().forEach(async (importDeclaration) => {
		const moduleSpecifier = importDeclaration
			.getModuleSpecifierValue()
			.replace(/^['"]|['"]$/g, '')

		// Dynamically categorize imports based on tsconfig paths
		const tsconfigPath = path.join(findProjectRoot(filePath), 'tsconfig.json')
		let tsconfigPaths: Record<string, string[]> = {}

		try {
			const tsconfigContent = await fs.readFile(tsconfigPath, 'utf8')
			const tsconfig = JSON.parse(tsconfigContent)
			tsconfigPaths =
				(tsconfig.compilerOptions && tsconfig.compilerOptions.paths) || {}
		} catch {
			// If tsconfig can't be read, fallback to default behavior
		}

		/**
		 * Determines if the given `moduleSpecifier` refers to an internal module.
		 *
		 * A module is considered internal if:
		 * - It is a relative import (starts with '.').
		 * - It matches any alias defined in `tsconfigPaths`, either exactly or as a prefix.
		 *
		 * @returns `true` if the module is internal, otherwise `false`.
		 */
		const isInternal = (() => {
			if (moduleSpecifier.startsWith('.')) return true
			for (const alias in tsconfigPaths) {
				// Remove trailing /* for matching
				const aliasPrefix = alias.replace(/\/\*$/, '')
				if (
					aliasPrefix &&
					(moduleSpecifier === aliasPrefix ||
						moduleSpecifier.startsWith(aliasPrefix + '/'))
				) {
					return true
				}
			}
			return false
		})()

		if (isInternal) {
			internalImports.add(moduleSpecifier)
		} else {
			externalPackages.add(moduleSpecifier)
		}
	})

	// Determine dev dependencies by checking package.json
	const devDependencies = new Set<string>()

	try {
		// Find project's package.json
		const projectRoot = findProjectRoot(filePath)
		const packageJsonPath = path.join(projectRoot, 'package.json')
		const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8')
		const packageJson = JSON.parse(packageJsonContent)

		// Check each external package against devDependencies
		for (const pkg of externalPackages) {
			const basePackage = pkg.split('/')[0]
			if (
				packageJson.devDependencies &&
				packageJson.devDependencies[basePackage]
			) {
				devDependencies.add(basePackage)
			}
		}
	} catch (error) {
		console.error('Error determining dev dependencies:', error)
	}

	let externalPackagesResult = [...externalPackages]
	let devDependenciesResult = [...devDependencies]

	// Add version information if requested
	if (includeVersion) {
		externalPackagesResult = await Promise.all(
			externalPackagesResult.map(async (pkg) => {
				const basePackage = pkg.split('/')[0]
				const version = await getPackageVersion(basePackage)
				return `${pkg}@${version}`
			}),
		)

		devDependenciesResult = await Promise.all(
			devDependenciesResult.map(async (pkg) => {
				const version = await getPackageVersion(pkg)
				return `${pkg}@${version}`
			}),
		)
	}

	return {
		externalPackages: externalPackagesResult,
		devDependencies: devDependenciesResult,
		internalImports: [...internalImports],
	}
}

/**
 * Find the project root by looking for package.json
 */
function findProjectRoot(startPath: string): string {
	let currentDir = path.dirname(startPath)

	while (currentDir !== '/') {
		try {
			if (existsSync(path.join(currentDir, 'package.json'))) {
				return currentDir
			}
		} catch {}

		const parentDir = path.dirname(currentDir)
		if (parentDir === currentDir) break
		currentDir = parentDir
	}

	return process.cwd()
}

/**
 * Gets the version of a specified npm package
 */
async function getPackageVersion(
	packageName: string,
	maxDepth = 10,
): Promise<string> {
	try {
		// Resolve the main entry point of the package
		const entryPoint = require.resolve(packageName, {
			paths: [process.cwd()], // Search from current directory
		})

		// Find the package.json by walking up from the entry point's directory
		let currentDir = path.dirname(entryPoint)
		let packageJsonPath

		let depth = 0
		while (currentDir !== '/' && depth < maxDepth) {
			depth++

			const potentialPath = path.join(currentDir, 'package.json')

			try {
				await fs.access(potentialPath)
				// Read the package.json to check if it's the right one
				const packageContent = await fs.readFile(potentialPath, 'utf8')
				const packageData = JSON.parse(packageContent)

				// Check if this package.json contains the name that matches our target package
				if (packageData.name === packageName) {
					packageJsonPath = potentialPath
					break
				}

				// If we're at a node_modules boundary and found a package.json, it's likely the right one
				if (
					(currentDir.includes('node_modules') &&
						currentDir.endsWith(packageName)) ||
					currentDir.endsWith(`${path.sep}${packageName}`)
				) {
					packageJsonPath = potentialPath
					break
				}
			} catch {
				// File not found or couldn't be parsed, continue walking up
			}
			const parentDir = path.dirname(currentDir)
			if (parentDir === currentDir) break // Reached the root
			currentDir = parentDir
		}

		if (packageJsonPath) {
			const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8')
			const packageJson = JSON.parse(packageJsonContent)

			if (!packageJson.version) {
				return 'version not found in package.json'
			}

			return packageJson.version
		} else {
			return 'package.json not found'
		}
	} catch (error) {
		// Fallback: Try reading from the project's package.json
		try {
			const projectRoot = findProjectRoot(process.cwd())
			const projectPackageJsonPath = path.join(projectRoot, 'package.json')
			const projectPackageJsonContent = await fs.readFile(
				projectPackageJsonPath,
				'utf8',
			)
			const projectPackageJson = JSON.parse(projectPackageJsonContent)
			const dependencies = {
				...(projectPackageJson.dependencies || {}),
				...(projectPackageJson.devDependencies || {}),
			}
			return dependencies[packageName] || 'not in project package.json'
		} catch (projError) {
			return 'resolution error'
		}
	}
}
