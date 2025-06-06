import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { StatusDot } from './badge'

const avatarVariants = tv({
	slots: {
		container: 'group relative',
		avatar:
			'rounded-full bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 p-1 shadow-2xl transition-all duration-300 group-hover:scale-105',
		content:
			'flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-800',
		image: 'h-full w-full rounded-full object-cover',
		fallback: '',
		status: 'absolute',
	},
	variants: {
		size: {
			sm: {
				avatar: 'h-12 w-12',
				fallback: 'text-xl',
				status: 'right-1 bottom-1 h-4 w-4',
			},
			md: {
				avatar: 'h-20 w-20',
				fallback: 'text-3xl',
				status: 'right-1 bottom-1 h-6 w-6',
			},
			lg: {
				avatar: 'h-32 w-32',
				fallback: 'text-5xl',
				status: 'right-2 bottom-2 h-6 w-6',
			},
			xl: {
				avatar: 'h-40 w-40',
				fallback: 'text-6xl',
				status: 'right-3 bottom-3 h-8 w-8',
			},
		},
	},
	defaultVariants: {
		size: 'md',
	},
})

export type AvatarVariants = VariantProps<typeof avatarVariants>

interface AvatarProps extends AvatarVariants {
	src?: string
	alt?: string
	fallback?: string
	status?: 'online' | 'away' | 'offline'
	showStatus?: boolean
	className?: string
}

export const Avatar: React.FC<AvatarProps> = ({
	src,
	alt = 'Avatar',
	size,
	fallback = '🎮',
	status = 'online',
	showStatus = false,
	className,
}) => {
	const {
		container,
		avatar,
		content,
		image,
		fallback: fallbackSlot,
		status: statusSlot,
	} = avatarVariants({ size })

	return (
		<div className={container({ class: className })}>
			<div className={avatar()}>
				<div className={content()}>
					{src ? (
						<img src={src} alt={alt} className={image()} />
					) : (
						<div className={fallbackSlot()}>{fallback}</div>
					)}
				</div>
			</div>

			{showStatus && <StatusDot status={status} className={statusSlot()} />}
		</div>
	)
}
