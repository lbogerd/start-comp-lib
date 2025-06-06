import React from 'react'
import { cn } from '~/logic/shared/cn'
import { StatusDot } from './badge'

interface AvatarProps {
	src?: string
	alt?: string
	size?: 'sm' | 'md' | 'lg' | 'xl'
	fallback?: string
	status?: 'online' | 'away' | 'offline'
	showStatus?: boolean
	className?: string
}

export const Avatar: React.FC<AvatarProps> = ({
	src,
	alt = 'Avatar',
	size = 'md',
	fallback = '🎮',
	status = 'online',
	showStatus = false,
	className,
}) => {
	const sizeClasses = {
		sm: 'w-12 h-12',
		md: 'w-20 h-20',
		lg: 'w-32 h-32',
		xl: 'w-40 h-40',
	}

	const fallbackSizeClasses = {
		sm: 'text-xl',
		md: 'text-3xl',
		lg: 'text-5xl',
		xl: 'text-6xl',
	}

	const statusPositionClasses = {
		sm: 'bottom-1 right-1',
		md: 'bottom-1 right-1',
		lg: 'bottom-2 right-2',
		xl: 'bottom-3 right-3',
	}

	const statusSizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-6 h-6',
		lg: 'w-6 h-6',
		xl: 'w-8 h-8',
	}

	return (
		<div className={cn('group relative', className)}>
			<div
				className={cn(
					'rounded-full bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 p-1 shadow-2xl transition-all duration-300 group-hover:scale-105',
					sizeClasses[size],
				)}
			>
				<div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-800">
					{src ? (
						<img
							src={src}
							alt={alt}
							className="h-full w-full rounded-full object-cover"
						/>
					) : (
						<div className={fallbackSizeClasses[size]}>{fallback}</div>
					)}
				</div>
			</div>

			{showStatus && (
				<StatusDot
					status={status}
					className={cn(
						'absolute',
						statusPositionClasses[size],
						statusSizeClasses[size],
					)}
				/>
			)}
		</div>
	)
}
