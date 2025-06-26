import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

interface Tab {
	key: string
	label: string
	icon?: string
}

const tabsVariants = tv({
	slots: {
		container:
			'flex flex-col space-y-2 rounded-2xl bg-slate-800/50 p-2 sm:flex-row sm:space-y-0 sm:space-x-2',
		tab: 'min-h-[3rem] flex-1 touch-manipulation rounded-xl px-3 py-3 text-sm font-bold transition-all sm:px-6 sm:py-4 sm:text-lg',
	},
	variants: {
		active: {
			true: {
				tab: 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg shadow-orange-400/30',
			},
			false: {
				tab: 'text-slate-400 hover:bg-slate-700 hover:text-white active:bg-slate-600',
			},
		},
	},
	defaultVariants: {
		active: false,
	},
})

export type TabsVariants = VariantProps<typeof tabsVariants>

interface TabsProps extends Omit<TabsVariants, 'active'> {
	tabs: Tab[]
	activeTab: string
	onTabChange: (tabKey: string) => void
	className?: string
}

export const Tabs: React.FC<TabsProps> = ({
	tabs,
	activeTab,
	onTabChange,
	className,
}) => {
	const { container, tab } = tabsVariants()

	return (
		<div className={container({ class: className })}>
			{tabs.map((tabItem) => (
				<button
					key={tabItem.key}
					onClick={() => onTabChange(tabItem.key)}
					className={tab({ active: activeTab === tabItem.key })}
				>
					{tabItem.icon && `${tabItem.icon} `}
					{tabItem.label}
				</button>
			))}
		</div>
	)
}

const tabContentVariants = tv({
	base: '',
})

export type TabContentVariants = VariantProps<typeof tabContentVariants>

interface TabContentProps extends TabContentVariants {
	value: string
	activeTab: string
	children: React.ReactNode
}

export const TabContent: React.FC<TabContentProps> = ({
	value,
	activeTab,
	children,
}) => {
	if (value !== activeTab) return null
	return <div className={tabContentVariants()}>{children}</div>
}
