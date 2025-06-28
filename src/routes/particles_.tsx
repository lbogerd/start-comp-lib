import { createFileRoute } from '@tanstack/react-router'

import { svgToDataUrl } from '~/logic/shared/svg'
import { WinParticles } from '../components/win-particles'
import { useState } from 'react'
import { Button } from '~/libs/kyc/ui/button'
import { ParticlesForm } from '~/components/particles-form'

export const Route = createFileRoute('/particles_')({
	component: RouteComponent,
})

function RouteComponent() {
	const [resetKey, setResetKey] = useState(0)
	const [formData, setFormData] = useState({
		particleCount: 50,
		duration: 3000,
		fpsLimit: 120,
	})
	const [active, setActive] = useState(true)

	// Example SVG strings taken from Lucide icons
	const bitcoin = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bitcoin-icon lucide-bitcoin"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/></svg>`

	const dollar = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dollar-sign-icon lucide-dollar-sign"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`

	const coins = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-coins-icon lucide-coins"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>`

	const party = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-party-popper-icon lucide-party-popper"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg>`

	const piggy = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-piggy-bank-icon lucide-piggy-bank"><path d="M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z"/><path d="M16 10h.01"/><path d="M2 8v1a2 2 0 0 0 2 2h1"/></svg>`

	// Create multiple SVG data URLs with different colors
	const multipleShapes = [
		svgToDataUrl(bitcoin, {
			stroke: '#FFD700',
			fill: 'none',
		}),
		svgToDataUrl(dollar, {
			stroke: '#FF69B4',
			fill: 'none',
		}),
		svgToDataUrl(coins, {
			stroke: '#00BFFF',
			fill: 'none',
		}),
		svgToDataUrl(party, {
			stroke: '#49B327',
			fill: 'none',
		}),
		svgToDataUrl(piggy, {
			stroke: '#7041E2',
			fill: 'none',
		}),
	]

	return (
		<div className="flex w-full flex-col items-center gap-6 bg-neutral-100 p-6">
			<h1 className="text-2xl font-bold">Particles Example</h1>

			<h2 className="text-lg">Adjust settings</h2>
			<ParticlesForm
				onSubmit={(values) => {
					setFormData(values)
					setActive(true)
					setResetKey((prev) => prev + 1) // Force re-mount
				}}
			/>

			<WinParticles
				key={resetKey} // Change key to force re-mount
				active={active}
				svgDataUrl={multipleShapes}
				particleCount={formData.particleCount}
				duration={formData.duration}
				fpsLimit={formData.fpsLimit}
			/>
		</div>
	)
}
