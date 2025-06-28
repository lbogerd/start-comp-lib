import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { Suspense } from 'react'
import { DefaultCatchBoundary } from '~/libs/internal/component/default-catch-boundary'
import { NotFound } from '~/libs/internal/component/not-found'
import { Sidebar, SidebarSkeleton } from '~/libs/internal/ui/sidebar'
import { getLibsServerFn } from '~/logic/server/server-functions/libs'
import { seo } from '~/logic/shared/seo'
import { ItemType } from '~/logic/shared/types'
import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			...seo({
				title: 'start-comp-lib',
				description: `start-comp-lib is an easy way to create and share components with your team.`,
			}),
		],
		links: [
			{ rel: 'stylesheet', href: appCss },
			{
				rel: 'apple-touch-icon',
				sizes: '180x180',
				href: '/apple-touch-icon.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '32x32',
				href: '/favicon-32x32.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '16x16',
				href: '/favicon-16x16.png',
			},
			{ rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
			{ rel: 'icon', href: '/favicon.ico' },
		],
	}),
	errorComponent: (props) => {
		return (
			<RootDocument>
				<DefaultCatchBoundary {...props} />
			</RootDocument>
		)
	},
	notFoundComponent: () => <NotFound />,
	component: RootComponent,
})

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	)
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="font-[Inter]">
			<head>
				<HeadContent />
				<link rel="preconnect" href="https://rsms.me/" />
				<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
			</head>

			<body className="flex min-h-dvh w-dvh min-w-dvw overflow-x-hidden overscroll-none bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
				{children}

				<TanStackRouterDevtools position="bottom-right" />
				<Scripts />
			</body>
		</html>
	)
}
