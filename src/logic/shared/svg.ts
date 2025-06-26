/**
 * Converts SVG string to data URL with color customization support
 * @param svgString - Raw SVG string
 * @param color - Optional color to apply to the SVG (replaces fill/stroke attributes)
 * @returns Base64 encoded data URL
 */
export const svgToDataUrl = (
	svgString: string,
	colors: {
		fill: 'currentColor' | 'none' | string
		stroke: 'currentColor' | 'none' | string
	} = {
		fill: 'currentColor',
		stroke: 'currentColor',
	},
): string => {
	let processedSvg = svgString.trim()

	// If color is provided, apply it to the SVG
	if (colors) {
		// Replace existing fill attributes with the new color
		processedSvg = processedSvg.replace(
			/fill="[^"]*"/g,
			`fill="${colors.fill}"`,
		)

		// Replace existing stroke attributes with the new col  or
		processedSvg = processedSvg.replace(
			/stroke="[^"]*"/g,
			`stroke="${colors.stroke}"`,
		)

		// If no fill or stroke attributes exist, add fill to the first element after <svg>
		if (!processedSvg.includes('fill=') && !processedSvg.includes('stroke=')) {
			// Find the first element after opening <svg> tag
			const svgMatch = processedSvg.match(/(<svg[^>]*>)(.*)(<\/svg>)/s)
			if (svgMatch) {
				const [, openTag, content, closeTag] = svgMatch
				// Add fill to the first path, polygon, circle, rect, etc.
				const elementWithColor = content.replace(
					/(<(path|polygon|circle|rect|ellipse|line|polyline)[^>]*?)>/,
					`$1 fill="${colors.fill}">`,
				)
				processedSvg = openTag + elementWithColor + closeTag
			}
		}
	}

	// Encode to base64 data URL
	return `data:image/svg+xml;base64,${btoa(processedSvg)}`
}
