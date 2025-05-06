#!/usr/bin/env node

// TODO: turn this into a module

import fs from 'fs/promises'
import { createRequire } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
// Get the directory of the current script
const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Construct path to the project root's package.json
const projectPackageJsonPath = path.resolve(__dirname, '../package.json')

/**
 * Retrieves the version of a specified npm package.
 *
 * This function attempts to find the version of a package by:
 * 1. Resolving the package's entry point
 * 2. Finding the package's package.json by walking up the directory tree
 * 3. Extracting the version from the package.json
 *
 * If the primary method fails, it falls back to checking the project's own
 * package.json dependencies and devDependencies.
 *
 * @param {string} packageName - The name of the npm package to get the version for
 * @returns {Promise<string>} A promise that resolves to the package version or an error message
 */
async function getPackageVersion(packageName: string): Promise<string> {
	try {
		// Resolve the main entry point of the package
		const entryPoint = require.resolve(packageName, {
			paths: [path.resolve(__dirname, '..')], // Search from project root
		})

		// Find the package.json by walking up from the entry point's directory
		let currentDir = path.dirname(entryPoint)
		let packageJsonPath

		while (currentDir !== '/') {
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
				console.log('could not find version for', packageName)

				console.log(packageJson)
				return 'version not found in package.json'
			}

			return packageJson.version
		} else {
			return 'package.json not found'
		}
	} catch (error) {
		console.error(`Error resolving version for ${packageName}:`, error)
		console.log("Using fallback: Try reading from the project's package.json")
		// Fallback: Try reading from the project's package.json (less accurate)
		try {
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
			console.error(
				`Error reading project package.json for fallback ${packageName}:`,
				projError,
			)
			return 'resolution error'
		}
	}
}

/**
 * Scans the internal components directory to find and report external dependencies.
 *
 * This function:
 * 1. Reads all TypeScript/JavaScript files in the internal components directory
 * 2. Parses each file to extract import statements using regex
 * 3. Identifies external dependencies (excluding React and internal imports)
 * 4. Retrieves and displays the version of each external dependency
 *
 * The function outputs the results to the console, showing each file and its
 * external dependencies with their versions.
 *
 * @async
 * @returns {Promise<void>}
 */
async function findExternalDependencies(): Promise<void> {
	const componentsDir = path.resolve(
		__dirname,
		'../src/components/libs/internal',
	) // Use absolute path

	try {
		const files = await fs.readdir(componentsDir)
		const tsxFiles = files.filter((file) => /\.(tsx?|jsx?)$/.test(file))

		for (const file of tsxFiles) {
			const filePath = path.join(componentsDir, file)
			const content = await fs.readFile(filePath, 'utf8')

			const importRegex =
				/import\s+(?:(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]((?:@[^/'"\s]+\/)?[^/'"\s.]+[^/'"\s]*)['"]/g
			const imports = new Set()
			let match

			while ((match = importRegex.exec(content)) !== null) {
				const fullPackageName = match[1]
				// Skip React and internal paths (starting with ~ or .)
				if (
					fullPackageName !== 'react' &&
					!fullPackageName.startsWith('~') &&
					!fullPackageName.startsWith('@/') &&
					!fullPackageName.startsWith('.')
				) {
					// Use the full package name, including scope
					imports.add(fullPackageName)
				}
			}

			const uniqueImports = [...imports]

			if (uniqueImports.length > 0) {
				console.log(`\nFile: ${file}`)
				console.log('External dependencies:')

				for (const packageName of uniqueImports) {
					const version = await getPackageVersion(packageName as string)
					console.log(`  - ${packageName}: ${version}`)
				}
			} else {
				console.log(`\nFile: ${file}`)
				console.log('No external dependencies found.')
			}
		}
	} catch (error) {
		console.error('Error processing components directory:', error)
	}
}

findExternalDependencies()
