import React, { useCallback, useMemo, useState } from 'react'
import Particles from 'react-particles'
import { loadSlim } from 'tsparticles-slim'

interface WinParticlesProps {
	/** Whether particles are active/playing */
	active?: boolean
	/** Duration in milliseconds for particle animation */
	duration?: number
	/** SVG data URL string(s) to use as particle shape(s) */
	svgDataUrl?: string | string[]
	/** Number of particles to emit */
	particleCount?: number
	/** FPS limit for the particle animation */
	fpsLimit?: number
	/** Custom colors for particles (when not using SVG) */
	colors?: string[]
	/** Container class name */
	className?: string
	/** Callback when animation completes */
	onComplete?: () => void
}

export const WinParticles: React.FC<WinParticlesProps> = ({
	active = false,
	duration = 3000,
	svgDataUrl,
	particleCount = 50,
	fpsLimit = 120,
	colors = ['#FFD700', '#FF6B35', '#F7931E', '#FFE66D', '#06FFA5'],
	className = '',
	onComplete,
}) => {
	// State to force re-mounting the Particles component for reset
	const [resetKey, setResetKey] = useState(0)

	const particlesInit = useCallback(async (engine: any) => {
		await loadSlim(engine)
	}, [])

	const svgImageUrls = useMemo(() => {
		if (!svgDataUrl) return undefined
		return Array.isArray(svgDataUrl) ? svgDataUrl : [svgDataUrl]
	}, [svgDataUrl])

	const particlesOptions = useMemo(
		() => ({
			background: {
				color: {
					value: 'transparent',
				},
			},
			fpsLimit,
			particles: {
				number: {
					value: active ? particleCount : 0,
				},
				color: {
					value: colors,
				},
				shape: {
					type: svgImageUrls ? 'image' : 'circle',
					...(svgImageUrls && {
						image: svgImageUrls.map((url) => ({
							src: url,
							width: 24,
							height: 24,
						})),
					}),
				},
				opacity: {
					value: { min: 0.3, max: 1 },
					animation: {
						enable: true,
						speed: 2,
						sync: false,
					},
				},
				size: {
					value: { min: 4, max: 12 },
					animation: {
						enable: true,
						speed: 3,
						sync: false,
					},
				},
				move: {
					enable: true,
					speed: { min: 2, max: 8 },
					direction: 'bottom',
					straight: false,
					outModes: {
						default: 'out',
					},
					attract: {
						enable: false,
						rotateX: 600,
						rotateY: 1200,
					},
				},
				rotate: {
					value: { min: 0, max: 360 },
					animation: {
						enable: true,
						speed: 5,
						sync: false,
					},
				},
				life: {
					duration: {
						sync: false,
						value: duration / 1000,
					},
					count: 1,
				},
			},
			emitters: {
				direction: 'top',
				life: {
					count: 1,
					duration: 0.1,
					delay: 0,
				},
				rate: {
					delay: 0.01,
					quantity: particleCount,
				},
				size: {
					width: 100,
					height: 0,
				},
				position: {
					x: 50,
					y: 100,
				},
			},
			detectRetina: true,
		}),
		[active, particleCount, colors, svgDataUrl, duration],
	)

	React.useEffect(() => {
		if (active && onComplete) {
			const timer = setTimeout(onComplete, duration)
			return () => clearTimeout(timer)
		}
	}, [active, duration, onComplete])

	// Handler to increment the resetKey, which will reset the animation
	const handleReset = () => {
		setResetKey((k) => k + 1)
	}

	return (
		<>
			{/* Button to reset/restart the animation by changing the key */}
			<button
				className="bg-opacity-80 hover:bg-opacity-100 pointer-events-auto rounded bg-white px-3 py-1 text-black shadow transition"
				onClick={handleReset}
			>
				Reset Animation
			</button>
			<div
				className={`pointer-events-none fixed inset-0 z-50 ${className}`}
				style={{ zIndex: 9999 }}
			>
				{/* The Particles component uses the resetKey as its key, so changing it will re-mount and restart the animation */}
				{active && (
					<Particles
						key={resetKey}
						id="win-particles"
						init={particlesInit}
						// @ts-expect-error
						options={particlesOptions}
					/>
				)}
			</div>
		</>
	)
}
