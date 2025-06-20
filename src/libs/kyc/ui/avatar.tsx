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
				avatar: 'h-10 w-10 sm:h-12 sm:w-12',
				fallback: 'text-lg sm:text-xl',
				status:
					'right-0.5 bottom-0.5 h-3 w-3 sm:right-1 sm:bottom-1 sm:h-4 sm:w-4',
			},
			md: {
				avatar: 'h-16 w-16 sm:h-20 sm:w-20',
				fallback: 'text-2xl sm:text-3xl',
				status: 'right-1 bottom-1 h-5 w-5 sm:h-6 sm:w-6',
			},
			lg: {
				avatar: 'h-24 w-24 sm:h-32 sm:w-32',
				fallback: 'text-4xl sm:text-5xl',
				status: 'right-1 bottom-1 h-5 w-5 sm:right-2 sm:bottom-2 sm:h-6 sm:w-6',
			},
			xl: {
				avatar: 'h-32 w-32 sm:h-40 sm:w-40',
				fallback: 'text-5xl sm:text-6xl',
				status: 'right-2 bottom-2 h-6 w-6 sm:right-3 sm:bottom-3 sm:h-8 sm:w-8',
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
