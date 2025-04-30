import { useEffect } from 'react'

type HotkeyOptions = {
	ctrl?: boolean
	meta?: boolean
	shift?: boolean
	alt?: boolean
}

export function useHotkey(
	keyCombinations: {
		key: string
		options: HotkeyOptions
	}[],
	callback: () => void,
) {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Check if any of the key combinations match
			const isHotkeyPressed = keyCombinations.some(({ key, options }) => {
				const keyMatches = event.key.toLowerCase() === key.toLowerCase()
				const ctrlMatches = !options.ctrl || event.ctrlKey
				const metaMatches = !options.meta || event.metaKey
				const shiftMatches = !options.shift || event.shiftKey
				const altMatches = !options.alt || event.altKey

				// If any modifier is specified in options, ensure the corresponding key is pressed
				const modifiersMatch =
					!(options.ctrl || options.meta || options.shift || options.alt) ||
					(options.ctrl && event.ctrlKey) ||
					(options.meta && event.metaKey) ||
					(options.shift && event.shiftKey) ||
					(options.alt && event.altKey)

				return (
					keyMatches &&
					ctrlMatches &&
					metaMatches &&
					shiftMatches &&
					altMatches &&
					modifiersMatch
				)
			})

			if (isHotkeyPressed) {
				event.preventDefault()
				callback()
			}
		}

		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [keyCombinations, callback])
}
